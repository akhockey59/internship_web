const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxLength:150,
        minLength: 3
    },
    email:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 150,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024
    }
},{
    timestamps: true
});
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;