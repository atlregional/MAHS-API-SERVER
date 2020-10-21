const tractinfo = require('../models/tractInfo')

// Defining methods
module.exports = {
    findAll: (req, res) => {
      console.log('tract info query: ',req.query);
      tractinfo.find(req.query)
        // .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: (req, res) => {
      console.log(req.body)
      tractinfo.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
      const { geoID} = req.body;
      
      tractinfo.findByIdAndUpdate(geoID, req.body)
        .then(dbModel => 
          {console.log("Update Tract Info",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 