const datainfo = require('../models/dataInfo')

// Defining methods
module.exports = {
    findAll: (req, res) => {
      console.log('data info query: ', req.query);
      datainfo.find(req.query)
        // .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
  
    
    create: (req, res) => {
      console.log(req.body)
      datainfo.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: (req, res) => {
      const { ID } = req.body;
      
      datainfo.findByIdAndUpdate(ID, req.body)
        .then(dbModel => 
          {console.log("Update Data Info",req.body)
          res.json(dbModel)})
        .catch(err => res.status(422).json(err));
    },
}; 