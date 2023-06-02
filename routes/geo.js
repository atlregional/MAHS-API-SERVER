const router = require('express').Router();
const geoControllers = require('../controllers/geoControllers');

router.route('/').get(geoControllers.findAll);

module.exports = router;