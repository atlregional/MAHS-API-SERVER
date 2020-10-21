const router = require("express").Router();
const tractDataController = require("../controllers/tractDataController");


router
.route("/")
.get(tractDataController.findAll)
.put(tractDataController.update)
.post(tractDataController.create);



module.exports = router