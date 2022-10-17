require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI;

const tractDataSeed = require('./data/tractData.json');
const tractInfoSeed = require('./data/tractinfoWithCities.json');
// const cityCrossWalkSeed = require('./data/tractToCityCrosswalk.json');
// const dataInfoSeed = require('./data/dataLabelManifests.json');
// const configSeed = require('./data/config.json');

const collection = process.argv[2];

const tractInfo = collection === 'tractinfo' ? 
  tractInfoSeed.map(tract => {
    const tractObj = {...tract};
    // tractObj.Cities = [];
    // cityCrossWalkSeed.forEach(tractWCity => 
    //   tractWCity.GEOID === tractObj.geoID ?
    //     tractObj.Cities.push(tractWCity.Cities) 
    //   : null);
    tractDataSeed.forEach(tractData =>
      tractData.GEOID.toString() === tract.GEOID.toString() ?
        tractObj.Data = tractData
      : null
    )
    return tractObj;
    }
  ) : null;

// console.log(tractInfo.filter(tract => tract.Cities.length > 0));

// const content = 
// // ternary for each collection here
//   collection === 'tractinfo' ? 
//     tractInfoWCityArray
//   // :collection === 'tractdata' ? 
//   //   tractDataSeed
//   :collection === 'datainfo' ? 
//     dataInfoSeed
//   : collection === 'config' ?
//     configSeed
//   : null; 

// const collection = 'tractinfo';
const infoSeed = () => {
tractInfoSeed.map(tract => {
  const tractObj = { ...tract };
  tractObj.cities = [];

  // cityCrossWalkSeed.forEach(tractWCity =>
  //   tractWCity.GEOID === tractObj.GEOID ?
  //     tractObj.cities.push(tractWCity.Cities)
  //     : null)
      return tractObj;
})

}

const seedConfig = {
  // datainfo: {
  //   active: false,
  //   content: require("../data/datainfo.json"),
  //   overwrite: true
  // },
  // tractdata: {
  //   active: false,
  //   content: require("../data/tractdata.json"),
  //   overwrite: true
  // },
  tractInfo: {
    active: true,
    content: tractInfo,
    overwrite: true
  },
}

// const tractInfoWCityArray = collection === 'tractinfo' ? 
//   tractInfoSeed.map(tract => {
//     const tractObj = {...tract};
//     tractObj.cities = [];
//     cityCrossWalkSeed.forEach(tractWCity => 
//       tractWCity.GEOID === tractObj.GEOID ?
//         tractObj.cities.push(tractWCity.Cities) 
//       : null);
//       console.log(tractObj)
//     return tractObj;
//     }
//   ) : null;


mongoose
  .connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Connection successful'))
  .catch(err => console.log(err));


Object.entries(seedConfig)
  .filter(([,value]) => value.active)
  .forEach(([key, config]) => {
  const seed = config.content;

  console.log(seed[0]);

    config.overwrite && db[key]
      // then remove and insert
      ? db[key]
        .remove()
        .then(() =>
          db[key].insertMany(seed))
        .then(data => {
          console.log(data.length + " records inserted!");
          process.exit(0);
        })
        .catch(err => {
          console.error(err);
          process.exit(1);
        })
      // or else if not true then just insert without removing
      : db[key].insertMany(seed)
        .then(data => {
          console.log(data.length + " records inserted!");
          process.exit(0);
        })
        .catch(err => {
          console.error(err);
          process.exit(1);
        })
});




















// const content = 
// // ternary for each collection here
//   collection === 'tractinfo' ? 
//     tractInfoWCityArray
//   :collection === 'tractdata' ? 
//     tractDataSeed
//   :collection === 'datainfoseed' ? 
//     dataInfoSeed
//   : null; 





// Use insertMany 

// db[collection]
//   .remove()
//   .then(() => 
//   db[collection].insertMany(content))
//     .then(data => {
//       console.log(data.length + " records inserted!");
//       process.exit(0);
//     })
//     .catch(err => {
//       console.error(err);
//       process.exit(1);
//     });