const localStrategy = require('passport-local').Strategy;
const User = require('../model/userModel.js');
const bcrypt = require('bcrypt');

module.exports = function(passport){
    const options = {
        usernameField: 'email',
        passwordField: 'password'
    };
    passport.use(new localStrategy(options, async (email, password, done) =>{
        try{
            const _user = await User.findOne({email: email});
            if(!_user){
                return done(null, false, {message: `User Couldn't found`});
            }

            const _userpassword = await bcrypt.compare(password, _user.password);
            if(!_userpassword){
                return done(null, false, {message: 'Password is false'});
            }
            else{
                if(_user && _user.isMailActivated === false){
                    return done(null, false, {message: `E-mail isn't activated, please verify your E-mail`});
                }else{
                    return done(null, _user);
                }
            }
        }catch(err){
            return done(err);
        }

    }));


    //save this user_id to session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    //get user_id from session and search it in the database
    passport.deserializeUser(async function(id, done){
        let user = await User.findById(id);
        let user_datas = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            avatar: user.avatar
        }
        done(null, user_datas);
    });
}





