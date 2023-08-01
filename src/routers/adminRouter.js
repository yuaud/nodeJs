const router = require('express').Router();
const adminController = require('../controllers/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const validatorMiddleware = require('../middlewares/validationMiddleware.js');



router.get('/login', authMiddleware.notSignedIn, adminController.getLoginForm);
router.post('/login', authMiddleware.notSignedIn, validatorMiddleware.validateLogin(), adminController.postLogin);



router.get('/register', authMiddleware.notSignedIn, adminController.getRegisterForm);
router.post('/register', authMiddleware.notSignedIn, validatorMiddleware.validateNewUser(), adminController.postRegister);


router.get('/forget_password', authMiddleware.notSignedIn, adminController.getForget_passwordForm);
router.post('/forget_password', authMiddleware.notSignedIn, validatorMiddleware.validateEmail(), adminController.postForget_password);


router.get('/passwordReset', adminController.getPasswordReset)
router.get('/passwordReset/:id/:token/', adminController.getPasswordReset)
router.post('/passwordReset', validatorMiddleware.validateNewPassword(), adminController.passwordReset);

router.get('/verify', adminController.verifyEmail);

module.exports = router;



