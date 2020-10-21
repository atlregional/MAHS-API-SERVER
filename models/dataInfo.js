const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataInfoSchema = new Schema({
    ID : {type: String, required: true},
    Type: {type: String, required: true},
    Units : {type: String},
    Label : {type: String, required: true},
    Year : {type: String || Number, required: true}
    
});

const dataInfo = mongoose.model('datainfo', dataInfoSchema);

module.exports = dataInfo;