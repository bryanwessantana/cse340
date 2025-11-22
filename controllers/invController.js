const invModel = require("../models/inventory-model")
const Util = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = Util.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await Util.buildClassificationGrid(data)
  let nav = await Util.getNav()
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

invCont.buildByInvId = Util.handleErrors(async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getInventoryByInvId(inv_id)

  if (!vehicleData) {
    throw { status: 404, message: "Sorry, that vehicle could not be found." }
  }

  const vehicle = vehicleData;

  const vehicleSingle = await Util.buildVehicleDetail(vehicle) 
  let nav = await Util.getNav()
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}` 

  res.render("./inventory/detail", {
    title,
    nav,
    vehicle,
    vehicleSingle,
  })
})

invCont.buildManagementView = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  const classificationList = await Util.buildClassificationList()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    notice: req.flash("notice"),
    classificationList,
  })
})

invCont.buildAddClassification = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  })
})

invCont.addClassification = Util.handleErrors(async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result && result.rowCount > 0) {
    req.flash("notice", `New ${classification_name} classification added successfully.`)
    const nav = await Util.getNav()
    return res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Provide a correct classification name.")
    const nav = await Util.getNav()
    return res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null,
    })
  }
})

invCont.buildAddVehicle = Util.handleErrors(async function (req, res, next) {
  const nav = await Util.getNav()
  const classificationList = await Util.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
})

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
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    const nav = await Util.getNav()
    const classificationList = await Util.buildClassificationList(classification_id)
    return res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
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

invCont.throwError = Util.handleErrors(async function (req, res, next) {
  throw new Error("Intentional 500 Error for testing.")
})

module.exports = invCont