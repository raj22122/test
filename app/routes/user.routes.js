const express = require('express');
const user = require("../controllers/user.controller.js");

const router = express.Router();


router.route("/createUser").post((req, res) => {
    user.createUser(req, res);
});

router.route("/getAll").get((req, res) => {
    user.getAllUser(req, res);
});

router.route("/createTransaction").post((req, res) => {
    user.createTransaction(req, res);
});

router.route("/transactionByUserId").get((req, res) => {
    user.getTransactionById(req, res);
});


module.exports = router