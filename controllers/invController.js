const invModel = require("../models/inventory-model")
const Util = require("../utilities/") // Renamed to Util for consistency

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = Util.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await Util.buildClassificationGrid(data)
  let nav = await Util.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
})

/* ***************************
 * Build inventory detail view (Task 1)
 * ************************** */
invCont.buildByInventoryId = Util.handleErrors(async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  // Check if vehicle data was retrieved
  if (!vehicleData) {
    // If no vehicle found, manually trigger a 404 (Not Found)
    throw { status: 404, message: "Sorry, that vehicle could not be found." }
  }

  const detailHTML = await Util.buildInventoryDetailsHTML(vehicleData)
  let nav = await Util.getNav()
  const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`

  res.render("./inventory/detail", {
    title: title,
    nav,
    detailHTML,
  })
})

/* ***************************
 * Test 500 Error Route (Task 3)
 * ************************** */
invCont.throwError = Util.handleErrors(async function (req, res, next) {
  // Intentionally throwing a server error (500)
  throw new Error("Intentional 500 Error for testing.")
})


module.exports = invCont