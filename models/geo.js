const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geoSchema = new Schema({
  "name":  {type: String},
  "features" : {type: Array}
})

const geos = mongoose.model('geo', geoSchema);

module.exports = geos;
