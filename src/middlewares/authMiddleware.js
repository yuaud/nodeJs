const signedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', ["Please sign in"]);
        res.redirect('/admin/login');
    }
}

const notSignedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/management/');
    }
}

module.exports = {
    signedIn,
    notSignedIn
}




