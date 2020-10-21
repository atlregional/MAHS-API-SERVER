const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tractInfoSchema = new Schema({
  GEOID : {type: String, required: true},
  County : {type: String, required: true},
  Subarea : {type: String, required: true},
  Cities : {type: Array, required: true},
  Data: {type: Object, required: true}  
});

const tractInfo = mongoose.model('tractinfo', tractInfoSchema);

module.exports = tractInfo;