const {body} = require('express-validator');

const validateNewUser = _ =>{
    return [
        body('email')
        .trim()
        .isEmail().withMessage('E-mail adress must be a valid E-mail address.'),
        body('password')
        .trim()
        .isLength({min: 6}).withMessage('Password must be minimum 6 characters long.')
        .isLength({max: 30}).withMessage('Password must be maximum 30 characters long.'),
        body('name')
        .trim()
        .isLength({min: 2}).withMessage('Name must be minimum 2 characters long.')
        .isLength({max: 30}).withMessage('Name must be maximum 30 characters long.'),
        body('surname')
        .trim()
        .isLength({min: 1}).withMessage('Surname must be minimum 1 characters long.')
        .isLength({max: 50}).withMessage('Surname must be maximum 50 characters long.'),
        body('passwordRe')
        .trim()
        .custom((value, {req}) =>{
            if(value !== req.body.password){
                throw new Error('Passwords does not match');
            }
            return true;
        })
    ];
}

const validateLogin = _ =>{
    return[
        body('email')
        .trim()
        .isEmail().withMessage('E-mail adress must be a valid E-mail address.'),
        body('password')
        .trim()
        .isLength({min: 6}).withMessage('Password must be minimum 6 characters long.')
        .isLength({max: 30}).withMessage('Password must be maximum 30 characters long.')
    ];
}

const validateEmail = _ =>{
    return[
        body('email')
        .trim()
        .isEmail().withMessage('E-mail adress must be a valid E-mail address.')
    ];
}

const validateNewPassword = _ =>{
    return [
        body('newPassword')
        .trim()
        .isLength({min: 6}).withMessage('Password must be minimum 6 characters long.')
        .isLength({max: 30}).withMessage('Password must be maximum 30 characters long.'),
        body('reNewPassword')
        .trim()
        .custom((value, {req}) =>{
            if(value !== req.body.newPassword){
                throw new Error('Passwords does not match');
            }
            return true;
        })
    ];
}


module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword

}



