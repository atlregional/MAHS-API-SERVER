const tractdata = require('../models/tractData')

// Defining methods
module.exports = {
    findAll: (req, res) => {
      console.log(req.query);
      tractdata.find(req.query)
      
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: (req, res) => {
      console.log(req.body)
      tractdata.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
      const { GEOID } = req.body;
      
      tractdata.findByIdAndUpdate(GEOID, req.body)
        .then(dbModel => 
          {console.log("Update Tract Data",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 