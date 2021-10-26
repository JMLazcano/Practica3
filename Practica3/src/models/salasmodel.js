const mongoose = require('mongoose');
const Schema = mongoose.Schema

const salaSchema = new Schema({
    salaId : {
        type : Number,
        required : true
    },
    salaName :{
        type : String,
        require : true
    },
    messages : {
        type: Array,
        require : true
    },
    owner : {
        type : String,
    },
    salaUrl : {
        type : String
    }

}, {timestamps : true});

const SalaModel = mongoose.model('SalaModel', salaSchema);
module.exports = SalaModel;