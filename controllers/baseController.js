const utilities = require("../utilities/")
const baseController = {}

// Wrap the async function with Util.handleErrors
baseController.buildHome = utilities.handleErrors(async function (req, res, next) {
  console.log('Fetching navigation data...')
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
})

// Intentional error route for testing error handling
baseController.causeError = async function (req, res, next) {
  const error = new Error("Intentional error for testing purposes")
  error.status = 500
  throw error
}

module.exports = baseController