const router = require("express").Router();
const configController = require("../controllers/configController");

router
.route("/")
.get(configController.findAll)
// .put(configController.update)
// .post(configController.create);



module.exports = router