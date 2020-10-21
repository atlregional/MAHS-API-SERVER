const router = require("express").Router();
const dataInfoController = require("../controllers/dataInfoController");


router
.route("/")
.get(dataInfoController.findAll)
.put(dataInfoController.update)
.post(dataInfoController.create);



module.exports = router