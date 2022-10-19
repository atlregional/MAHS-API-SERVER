const router = require('express').Router();
const tractInfoController = require('../controllers/tractInfoController');

router
  .route('/')
  .get(tractInfoController.findAll)
  .put(tractInfoController.update)
  .post(tractInfoController.create);

router.route('/csv-download').get(tractInfoController.csvDownload);

module.exports = router;
