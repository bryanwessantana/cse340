const utilities = require("../utilities/")
const baseController = {}

// Wrap the async function with Util.handleErrors
baseController.buildHome = utilities.handleErrors(async function (req, res, next) {
  console.log('Fetching navigation data...')
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
})

module.exports = baseController