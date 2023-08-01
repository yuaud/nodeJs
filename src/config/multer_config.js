const multer = require('multer');
const path = require('path');

//where to upload images
const avatarStorage = multer.diskStorage({
    //after storage process, set destination
    destination: (req, file, cb) =>{
        //destination turns a cb which is gets two parameters(error, dirname)
        cb(null, path.join(__dirname, "../uploads/avatars"));
    },
    filename: (req, file, cb) =>{
        //what name will u save ur file?
        //cb(error, your file name);
        cb(null, req.user.email+ ""+ path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        //if file type is jpeg or png return true
        cb(null, true);
    }else{
        //if file type is something else than jpeg or png then return false
        cb(null, false);
    }
}

const uploadAvatar = multer({storage: avatarStorage, fileFilter: imageFileFilter});


module.exports = uploadAvatar;