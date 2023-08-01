const router = require('express').Router();
const managementController = require('../controllers/managementController');
const authMiddleware = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multer_config');


router.get('/', authMiddleware.signedIn, managementController.index);

router.get('/logout', authMiddleware.signedIn, managementController.logout);

router.get('/profile', authMiddleware.signedIn, managementController.getProfile);

router.post('/profile-update', authMiddleware.signedIn, multerConfig.single('avatar'), managementController.postProfileUpdate);


module.exports = router;

