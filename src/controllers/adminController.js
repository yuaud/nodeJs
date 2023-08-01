//required packages
const path = require('path');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/userModel.js');
const passport = require('passport');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('../config/passportLocal.js')(passport);


//get-post login
const getLoginForm = (req, res) =>{
    res.render('login.ejs', {layout: './layout/auth_layout.ejs', title:'Log in'});
}
const postLogin = async (req, res) =>{
    //check if there are any errors in previous login form
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('validation_error', errors.array());
        res.redirect('login');
    }
    //if there aren't any errors then log in
    else{
        passport.authenticate('local', {
            successRedirect: '/management/',
            failureRedirect: '/admin/login',
            failureFlash: true
        })(req, res);
    }

}


//get-post register
const getRegisterForm = (req, res)=>{
    res.render('register', {layout: './layout/auth_layout.ejs', title: 'Register'});
}
const postRegister = async (req, res)=>{
    //check if there are any errors in previous register form
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('validation_error', errors.array());
        req.flash('name', req.body.name);
        req.flash('surname', req.body.surname);
        req.flash('email', req.body.email);
        res.redirect('register');
    }
    //if form is okay run codes at below
    else{
        try{
            //try to find registered user in db with registered mail adress
            const _user = await User.findOne({email: req.body.email});
            //if registered mail adress couldn't found in db
            //or user found in db but isMailActivated is false(this means someone registered with that mail but didn't activated mail)
            //then this mail is free for registering
            //send all register form's datas to db 
            if(!_user || (_user && _user.isMailActivated == false))
            {
                //if user found but E-mail isnt activated, because of E-mail isnt activated(this means an user tried to register with another person's e-mail so do not have acces to that e-mail)
                //another user wants to register with that e-mail but in this project's database email is unique so another user can't register with that e-mail even that e-mail belongs to current user
                //we'll remove the previous user which is registered but didnt verify his(or her) e-mail
                if(_user && _user.isMailActivated == false){
                    await User.findOneAndRemove({_id: _user._id});
                }
                const newUser = new User({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10)
                });
                //end

                //save new user to database
                await newUser.save();
                //end

                //jwt(JsonWebToken) codes for sending an e-mail
                const jwtDatas = {
                    id: newUser.id,
                    email: newUser.email
                }
                const jwtToken = jwt.sign(jwtDatas, process.env.JWT_SECRET_KEY_MAIL, {expiresIn: '2d'});
                //end

                //sending an e-mail for verify
                const url = process.env.WEB_SITE_URL+'admin/verify?id='+jwtToken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });
                await transporter.sendMail({
                    from: 'Node Mailer',
                    to: newUser.email,
                    subject: 'Please Verify Your E-mail',
                    text: 'Please click to the link to confirm your E-mail: '+url
                }, (err, info) =>{
                    if(err){
                        return console.log("there is an error: "+err);
                    }
                    console.log("Mail successfully sent");
                    transporter.close();
                });
                req.flash('success', [{msg: 'Please verify your E-mail!'}]);
                res.redirect('login');
            }
            //if email which is user trying to register is already registered, then send an error message to rendered page
            else if(_user &&_user.isMailActivated == true){
                    req.flash('validation_error', [{msg: 'This E-mail already in use'}]);
                    req.flash('name', req.body.name);
                    req.flash('surname', req.body.surname);
                    res.redirect('register');
            }
        }
        //catch if any error occours
        catch(err){
            console.log("there is error: "+err);
        }
    }
}



//get-post forget_password
const getForget_passwordForm = (req, res) =>{
    res.render('forget_password.ejs', {layout: './layout/auth_layout.ejs', title:'Forget Password'});
}
const postForget_password = async (req, res) =>{
    //chech if is mail true
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('validation_error', errors.array());
        req.flash('email', req.body.email);
        res.redirect('forget_password');
    //end

    //run codes at below if mail is valid
    }else{
        try{
            const result = await User.findOne({email: req.body.email});
            if(!result){
                req.flash('validation_error', [{msg:`This E-mail isn't registered.`}])
                res.redirect('forget_password');
            }
            else if((result && result.isMailActivated == false)){
                req.flash('validation_error', [{msg:`Please Verify Your E-mail First.`}]);
                res.redirect('forget_password');
            }
            else{
                jwtDatas = {
                    id: result.id,
                    email: result.email
                }
                const secret_key = process.env.JWT_SECRET_KEY_PASSWORD_RESET+"-"+result.password;
                const jwtToken = jwt.sign(jwtDatas, secret_key, {expiresIn: '1d'});
                const url = process.env.WEB_SITE_URL+'admin/passwordReset/'+result.id+"/"+jwtToken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });
                await transporter.sendMail({
                    from: 'Node Mailer',
                    to: req.body.email,
                    subject: 'Password Reset Link',
                    text: 'Click to the link for reset your password: '+url
                }, (err, info) =>{
                    if(err){
                        return console.log("there is an error: "+err);
                    }
                    console.log("Mail successfully sent");
                    transporter.close();
                });
                req.flash('success', [{msg: 'E-mail Sent!'}]);
                res.redirect('forget_password'); 
            }
        }catch(err){

        }
    }
}


//get-post passwordReset
const getPasswordReset = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    if(id && token){
        
        try{
            const result = await User.findById(id);
            const secret_key = process.env.JWT_SECRET_KEY_PASSWORD_RESET+"-"+result.password;
            jwt.verify(token, secret_key, async (err, decoded) =>{
                if(err){
                    req.flash('error', 'Token invalid or Expired');
                    res.redirect('/admin/forget_password');
                }
                else{
                    res.render('newPassword', {id:id, token: token, layout: './layout/auth_layout.ejs', title:'Password Reset'});
                }
            });
        }catch(err){

        }

    }else{
        req.flash('validation_error', [{msg:`Please click the link at the mail we sent you.`}]);
        res.redirect('forget_password');
    }
}
const passwordReset = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('validation_error', errors.array());
        res.redirect('passwordReset/'+req.body.id+"/"+req.body.token);
    }
    else{
        const result = await User.findOne({_id: req.body.id, isMailActivated: true});
        const secret_key = process.env.JWT_SECRET_KEY_PASSWORD_RESET+"-"+result.password;
        try{
            jwt.verify(req.body.token, secret_key, async (err, decoded) =>{
                if(err){
                    req.flash('error', 'Token invalid or Expired');
                    res.redirect('forget_password');
                }
                else{
                    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
                    const result = await User.findByIdAndUpdate(req.body.id, {password: hashedNewPassword});
                    if(result){
                        req.flash('success', [{msg: 'Password Updated'}]);
                        res.redirect('login'); 
                    }else{
                        req.flash('validation_error', [{msg: `Password Couldn't Updated`}]);
                        res.redirect('passwordReset/'+req.body.id+"/"+req.body.token);
                    }
                }
            });
        }catch(err){

        }

    }
}


//get admin/verify
const verifyEmail = (req, res) =>{
    const token = req.query.id;
    if(token){
        try{
            jwt.verify(token, process.env.JWT_SECRET_KEY_MAIL, async (err, decoded) =>{
                if(err){
                    req.flash('error', 'Token invalid or Expired');
                    res.redirect('login');
                }
                else{
                    const result = await User.findByIdAndUpdate({_id: decoded.id}, {isMailActivated: true});
                    if(result){
                        req.flash('success', [{msg:'E-mail Verified'}]);
                        res.redirect('login');
                    }else{
                        return req.flash('error', 'Please create an account again');
                    }
                }
            });
        }catch(err){

        }

    }else{
        req.flash('error', `Token couldn't found`);
        res.redirect('login');
    }
}


module.exports = {

    getLoginForm,
    postLogin,

    getRegisterForm,
    postRegister,

    getForget_passwordForm,
    postForget_password,

    getPasswordReset,
    passwordReset,

    verifyEmail

}









