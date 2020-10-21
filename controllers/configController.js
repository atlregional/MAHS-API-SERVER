const config = require('../models/config');

module.exports = {
  findAll: (req, res) => {
    console.log('config query: ',req.query);
    config.find(req.query)
      // .sort({ date: -1 })
      .then(dbModel => {
        console.log(dbModel);
        return res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  }
}
