//for useage of .env
const dotenv = require('dotenv').config();

//packages
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const expressSessions = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');


//db connection
require('./src/config/database.js');
const mongoDBStore = require('connect-mongodb-session')(expressSessions);


//create express and use middlewares
const app = express();
app.use(expressLayouts);
app.use(express.urlencoded({extended: true}));
/* formdan resim almak için forma enctype="multipart/form-data" bu değeri giriyoruz.
* bu değeri okumak için bize multer middleware'si lazim*/

app.use(express.static('public'));

//make uploads file static for accessing avatars
app.use('/uploads', express.static(path.join(__dirname, '/src/uploads/')));
const sessionStore = new mongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'userSessions'
})


//template engine settings
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));


//sessions and flash messages
app.use(expressSessions({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //expire in one week
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: sessionStore
}));
app.use(flash());


//codes at below will run every get request(also redirect bcs every redirect is a get request) 
app.use((req, res, next)=>{
    res.locals.validation_error = req.flash('validation_error'); 
    res.locals.success = req.flash('success');
    res.locals.name = req.flash('name');
    res.locals.surname = req.flash('surname');
    res.locals.email = req.flash('email');
    res.locals.loginError = req.flash('error');
    next();
}); 

//passport initialize
app.use(passport.initialize());
app.use(passport.session());

//localhost:3000/ get request
let sayac = 0;
app.get('/', (req,res) =>{
    if(req.session.sayac){
        req.session.sayac++;
    }else{
        req.session.sayac = 1;
    }
    res.json({
        mesaj: "hi",
        sayac: req.session.sayac
    });
});

//routers
const adminRouter = require('./src/routers/adminRouter.js');
const managementRouter = require('./src/routers/managementRouter.js');

//use routers
app.use('/admin', adminRouter);
app.use('/management', managementRouter);


//listen this port
app.listen(process.env.PORT, _ =>{
    console.log(`server listening this port: ${process.env.PORT} `);
});



