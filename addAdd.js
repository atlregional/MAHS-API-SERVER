require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const csvToJson = require('convert-csv-to-json')
const MONGODB_URI = process.env.MONGODB_URI;

const dataPath = './data/All_CensusTract2010_2021.csv';
const collection = 'tractInfo';

const dataArray = csvToJson.fieldDelimiter(',').getJsonFromCsv(dataPath);

const run = async () => {
  await mongoose
  .connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Connection successful'))
  .catch(err => {throw err});

  for await (obj of dataArray){

      const suppress = new Number(obj.TotalTransactionsWithSalePrice2021) <= 10;

      console.log(obj.geo, suppress ? '🚫' : '✅');
      await db[collection].findOneAndUpdate({GEOID: obj.geo}, { $set : {
        "Data.Aggregate Home Sales, 2021": !suppress ? new Number(obj.GrossMaxSalePrice2021) : '',
        "Data.Aggregate Building Area of Home Sales, 2021": !suppress ? new Number(obj.GrossBuildingAreaInferred2021) : ''
      }})
      // await db[collection].updateOne({GEOID: obj.GEOID}, { Data: {
      //   ['Aggregate Home Sales, 2021']: obj.AggregateHomesSales},
      //   ['Aggregate Building Area of Home Sales, 2021']: obj.AggregateBuildingAreaofHomesSales
      // }, (err) => console.log(err)); 
    // i++
    // }
  // } 
  // )
  }

};

run()
.then(() => process.exit(0))
.catch(() => console.log(err));



  // db[collection].update({})
  // .then(data => {
  //   console.log(data.length + " records inserted!");
  //   process.exit(0);
  // })
  // .catch(err => {
  //   console.error(err);
  //   process.exit(1);
  // })