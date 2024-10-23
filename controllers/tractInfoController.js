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
      const indicatorsArr = await dataInfo.find(idArr[0] ? { _id: { $in: idArr } } : {}).lean();

      const resultObj = {};
      const aggregator = 'GEOID';

      for (const { GEOID, Subarea } of tractsArr) {
        resultObj[GEOID] = {
          Submarket: Subarea
        };
      }
      resultObj['All'] = {};

      for (const indicator of indicatorsArr) {
        const aggregatedData = aggregate(tractsArr, indicator, aggregator);

        for (const key of Object.keys(aggregatedData)) {
          resultObj[key]['Census Tract ID'] = key;
          resultObj[key][indicator.name] = aggregatedData[key] || '';
        }
      }

      const fileName = `MAHS-Census-Tract-Data-${geo || '11-County'}.csv`;
      const title = `TITLE: MAHS Census Tract Data ${geo || '11-County'}`;
      const source = 'SOURCE: MAHS DATA EXPLORER - https://data.metroatlhousing.org/';
      const csvStr = parse(Object.values(resultObj));

      let resStr = '';
      resStr += `${title} \n`;
      resStr += `${source} \n \n`;
      resStr += csvStr;

      res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);
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
