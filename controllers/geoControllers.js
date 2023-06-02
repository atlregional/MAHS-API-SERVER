const geos = require("../models/geo");

 module.exports = {
  findAll: (req,res) => {
    const query = req.query;
    console.log(query);
    geos
      .findOne(query)
      .then((dbModel) => {
        res.json(dbModel)
  })
      .catch((err) => res.status(422).json(err));
  }
 }