const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
  style : {type: Object, required: true},
  selection : {type: Object, required: true},
  layers : {type: Array, required: true},
  tilelayers : {type: Array, required: true}
});

const config = mongoose.model('config', configSchema);

module.exports = config;