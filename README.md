# nodeJs
a nodeJs project

I tried to use passport.js, bcrypt, ejs, dotenv, nodemailer, multer, sessions, jwt, cookies etc... in this project.
I'am still trying to learn back-end programming. I used bootstrap for front-end, my main focus was back-end programming so i didn't do much at front-end except making it dynamic via ejs.

For you to use this project, you need to set an .env file. Contents of .env file must be:
PORT = a free port
MONGODB_CONNECTION_STRING = your mongodb connection string 
SECRET_SESSION = your secret session key
JWT_SECRET_KEY_MAIL = your secret key for mail links
JWT_SECRET_KEY_PASSWORD_RESET = your secret key for password reset links
WEB_SITE_URL = web site url like localhost:3000/
GMAIL_USER = example@gmail, for sending e-mail activation links
GMAIL_PASSWORD = example@gmail's password

you also need to create an app password for gmail to letting Gmail give access to third party softwares, apps. If you don't do that Gmail won't allow you to access your mail via nodemailer.
