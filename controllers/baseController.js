const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  console.log('Fetching navigation data...')
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController