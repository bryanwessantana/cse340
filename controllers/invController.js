const invModel = require("../models/inventory-model")
const Util = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = Util.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await Util.buildClassificationGrid(data)
  let nav = await Util.getNav()
  // Ensure data exists before trying to access index 0
  if (!data || data.length === 0) {
    throw { status: 404, message: "Sorry, no vehicles could be found for that classification." }
  }
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
})

/* ***************************
 * Build single vehicle view
 * ************************** */
invCont.buildByInvId = Util.handleErrors(async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getInventoryByInvId(inv_id)

  // Check if vehicle data was retrieved
  if (!vehicleData || vehicleData.length === 0) {
    // If no vehicle found, manually trigger a 404 (Not Found)
    throw { status: 404, message: "Sorry, that vehicle could not be found." }
  }

  // Assuming getInventoryByInvId returns an array, take the first element (common for DB results)
  const vehicle = vehicleData[0]
  const vehicleSingle = Util.buildVehicleDetail(vehicle)
  let nav = await Util.getNav()
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

  res.render("./inventory/detail", {
    title,
    nav,
    vehicle, // Pass the vehicle data itself (as done in the original code's render)
    vehicleSingle, // Pass the built HTML detail (what your original code named `detailHTML`)
  })
})

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagementView = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  // Need to build the classification list for the classification dropdown
  const classificationList = await Util.buildClassificationList()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    notice: req.flash("notice"), // Retrieve flash message
    classificationList, // Pass classification list to view
  })
})

/* ***************************
 * Build add-classification view
 * ************************** */
invCont.buildAddClassification = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  })
})

/* ***************************
 * Insert new classification
 * ************************** */
invCont.addClassification = Util.handleErrors(async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result && result.rowCount > 0) {
    req.flash("notice", `New ${classification_name} classification added successfully.`)
    const nav = await Util.getNav()
    // Redirect to management view after successful insert
    return res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Provide a correct classification name.")
    const nav = await Util.getNav()
    return res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null, // Should be replaced with actual validation errors if present
    })
  }
})

/* ***************************
 * Build Add New Vehicle View
 * ************************** */
invCont.buildAddVehicle = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  // Need to build the classification list for the dropdown
  const classificationList = await Util.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
})

/* ***************************
 * Add New Vehicle Into Inventory
 * ************************** */
invCont.addInventory = Util.handleErrors(async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result && result.rowCount > 0) {
    req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
    // Redirect to management view after successful insert
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    const nav = await Util.getNav()
    // Rebuild classification list, preserving the selected classification for user convenience
    const classificationList = await Util.buildClassificationList(classification_id)
    return res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null, // Should be replaced with actual validation errors if present
      // Retain all submitted form data
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
})

/* ***************************
 * Test 500 Error Route
 * ************************** */
invCont.throwError = Util.handleErrors(async function (req, res, next) {
  // Intentionally throwing a server error (500)
  throw new Error("Intentional 500 Error for testing.")
})

module.exports = invCont