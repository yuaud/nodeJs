const User = require('../model/userModel');


const index = (req, res) =>{
    res.render('index.ejs', {layout: './layout/management_layout.ejs', user: req.user, title: 'Main Page'});
}


const logout = (req, res, next) =>{
    req.logout(function(err){
        if(err){return next();}
        req.session.destroy(err =>{
            res.redirect('/admin/login');
        }); 
    });
    
}


const getProfile = (req,res, next) =>{
    res.render('profile.ejs', {layout:'./layout/m2_layout.ejs', user: req.user, title: 'Profile'});
}

const postProfileUpdate = async (req, res, next) =>{

    const updateDatas = {
        name: req.body.name,
        surname: req.body.surname
    }

    try{
        if(req.file){
            updateDatas.avatar = req.file.filename;
        }
        
        const result = await User.findByIdAndUpdate(req.user.id, updateDatas);
        if(result){
            res.redirect('profile');
        }

    }catch(err){
        console.log("there is an error: "+err);
    }
}



module.exports = {
    index,
    logout,
    getProfile,
    postProfileUpdate
}





