const router = require("express").Router();
const cityCrossWalkController = require("../controllers/cityCrossWalkController");

router
.route("/")
.get(cityCrossWalkController.findAll)
.put(cityCrossWalkController.update)
.post(cityCrossWalkController.create);



module.exports = router