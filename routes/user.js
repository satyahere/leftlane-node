const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.get("", UserController.getUser);

router.put("", UserController.updateUser);

module.exports = router;
