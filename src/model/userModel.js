const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, 'Name field cannot be empty.'],
            trim: true,
            minLength: 2,
            maxLength: 30
        },
        surname:{
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 50
        },
        email:{
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        isMailActivated:{
            type: Boolean,
            default: false
        },
        password:{
            type: String,
            required: true,
            trim: true
        },
        avatar:{
            type: String,
            default: 'default.png'
        }
    },
    {
        methods:{
            /* toJSON(){
                const user = this.toObject();
                delete user.__v;
                delete user.password
                return user;
            }  */
        },
        statics:{

        }
    },
    {collection: 'users', timestamps:true});


const user = mongoose.model('User', userSchema);

module.exports = user;



