/* ******************************************
 * Needed Resources
 *******************************************/
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ******************************************
 * Account Update Routes
 *******************************************/
router.get(
  "/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

/* ******************************************
 * Account Management Default View
 *******************************************/
// Route to deliver the account management view (e.g., /account/)
router.get(
  "/", 
  utilities.checkJWTToken, // <-- ADDED: Middleware to check for a valid login token
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ******************************************
 * Deliver Login View
 *******************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ******************************************
 * Deliver Registration View
 *******************************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister))


/* ******************************************
 * Process Login Request
 *******************************************/
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), 
  regValidate.checkLoginData, 
  utilities.handleErrors(accountController.accountLogin) 
)

/* ******************************************
 * Process Registration
 *******************************************/
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router