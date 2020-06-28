const express = require("express");

const AddressController = require("../controllers/address");

const router = express.Router();

router.post("", AddressController.createData);

module.exports = router;
