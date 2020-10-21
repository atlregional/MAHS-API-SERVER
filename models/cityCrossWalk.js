const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cityCrossWalkSchema = new Schema({
    GEOID : {type: Number, required: true},
    cities : {type: String, required: true},    
});

const cityCrossWalk = mongoose.model('citycrosswalk', cityCrossWalkSchema);

module.exports = cityCrossWalk;