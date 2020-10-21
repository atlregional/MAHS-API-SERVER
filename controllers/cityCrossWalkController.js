const citycrosswalk = require('../models/cityCrossWalk')

// Defining methods
module.exports = {
    findAll: (req, res) => {
      console.log(req.query);
      citycrosswalk.find(req.query)
        // .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: (req, res) => {
      console.log(req.body)
      citycrosswalk.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
      const { GEOID } = req.body;
      
      citycrosswalk.findByIdAndUpdate(GEOID, req.body)
        .then(dbModel => 
          {console.log("Update Info",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 