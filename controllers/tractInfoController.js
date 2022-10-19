const { parse } = require('json2csv');

const tractinfo = require('../models/tractInfo');
const dataInfo = require('../models/dataInfo');
const aggregate = require('../aggregate');

// Defining methods
module.exports = {
  findAll: (req, res) => {
    console.log('tract info query: ', req.query);
    tractinfo
      .find(req.query)
      // .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  csvDownload: async ({ query }, res) => {
    try {
      const { indicatorIDs, geo, geoType } = query;

      const filterKey = geoType === 'City' ? 'Cities' : geoType === 'County' ? geoType : null; // Region = null
      const filter = filterKey ? { [filterKey]: geo } : {};
      const tractsArr = await tractinfo.find(filter).lean();

      const idArr = indicatorIDs ? indicatorIDs.split(',') : [];
      const indicatorsArr = await dataInfo.find({ _id: { $in: idArr } }).lean();

      const aggregator = 'GEOID';
      const csvArray = [];

      for (const indicator of indicatorsArr) {
        const aggregatedData = aggregate(tractsArr, indicator, aggregator);

        const obj = {
          indicator: indicator.name,
          ...aggregatedData
        };

        csvArray.push(obj);
      }

      const fileName = `MAHS-Census-Tract-Data-${geo}.csv`;
      const title = `TITLE: MAHS Census Tract Data ${geo}`;
      const source = 'SOURCE: MAHS DATA EXPLORER - https://data.metroatlhousing.org/';
      const fields = Object.keys(csvArray[0]).filter(key => key !== 'All');
      fields.push('All'); // Move 'All' field to end of header array

      const csv = parse(csvArray, { fields });

      let resStr = '';
      resStr += `${title} \n`;
      resStr += `${source} \n \n`;
      resStr += csv;

      res.status(200).attachment(fileName).send(resStr);
    } catch (err) {
      console.log(err);
      res.status(422).json(err);
    }
  },
  create: (req, res) => {
    console.log(req.body);
    tractinfo
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: (req, res) => {
    const { geoID } = req.body;

    tractinfo
      .findByIdAndUpdate(geoID, req.body)
      .then(dbModel => {
        console.log('Update Tract Info', req.body);
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  }
};
