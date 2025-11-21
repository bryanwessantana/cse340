const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { handleErrors } = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/login", handleErrors(accountController.buildLogin));

router.get("/register", handleErrors(accountController.buildRegister));

router.post(
  "/register",
  express.json({ limit: '1kb' }), 
  express.urlencoded({ extended: true, limit: '1kb' }),
  regValidate.registrationRules(),
  regValidate.checkRegData,
  handleErrors(accountController.registerAccount)
);

module.exports = router;