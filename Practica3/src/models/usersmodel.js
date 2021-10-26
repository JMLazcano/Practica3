const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    correo :{
        type : String,
        require : true
    },
    password: {
        type: String,
        require : true
    }
}, {timestamps : true});

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;