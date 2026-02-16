/* ******************************************
 * Account routes
 * Unit 4, deliver login view activity
 * ****************************************** */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/* ******************************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 * ****************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ******************************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 * ****************************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))


/* ******************************************
 * Default Account Management View
 ****************************************** */
router.get("/", utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement)
)

/* ******************************************
 *  Registration process
 * 
 * ****************************************** */
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


// Deliver update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateView))

// Process Account Info Update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process Password Update
router.post(
  "/change-password",
  regValidate.passwordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.changePassword)
)


// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.logout))


module.exports = router