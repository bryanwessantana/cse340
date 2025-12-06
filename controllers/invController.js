const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  // NOTE: This line can crash if data is empty. Ensure data is checked before accessing index 0.
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getInventoryByInvId(inv_id)

    console.log("Vehicle data:", vehicleData) // debug

    if (!vehicleData) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const nav = await utilities.getNav()
    const vehicleSingle = utilities.buildVehicleDetail(vehicleData)
    const title = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      vehicle: vehicleData,
      vehicleSingle,
    })
  } catch (err) {
    err.status = err.status || 500
    next(err)
  }
}

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    
    // Calls the robust classification list builder
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      notice: req.flash("notice"),
      classificationSelect, // Passes list to view
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Insert new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body

    const result = await invModel.addClassification(classification_name)

    if (result.rowCount > 0) {
      req.flash("notice", `New ${classification_name} classification added successfully.`)
      return res.redirect("/inv/") 
    } else {
      req.flash("notice", "Provide a correct classification name.")
      const nav = await utilities.getNav()
      return res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classification_name,
        errors: null,
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build Add New Vehicle View
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Add New Vehicle Into Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
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

    if (result.rowCount > 0) {
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)
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
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 * Deliver delete confirmation view
 * ************************************ */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const itemData = await invModel.getInventoryByInvId(inv_id)
  
  if (!itemData) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/")
  }
  
  const nav = await utilities.getNav()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const title = `Delete ${itemName}`

  res.render("inventory/delete-confirm", {
    title,
    nav,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_id: itemData.inv_id, 
  })
}

/* ****************************************
 * Process inventory deletion
 * ************************************ */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id, inv_make, inv_model } = req.body
  
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult && deleteResult.rowCount > 0) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully deleted.`)
    res.redirect("/inv/") 
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInvId(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    const title = `Delete ${itemName}`
    
    res.status(501).render("inventory/delete-confirm", {
      title,
      nav,
      errors: null,
      inv_make: inv_make,
      inv_model: inv_model,
      inv_price: itemData.inv_price,
      inv_year: itemData.inv_year,
      inv_id: inv_id,
    })
  }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
 * Process classification deletion (NEW)
 * ************************************ */
invCont.deleteClassification = async function (req, res, next) {
  const { classification_id } = req.body
  
  // 1. Fetch the classification name for user messages
  const classifications = await invModel.getClassifications()
  const targetClassification = classifications.rows.find(c => c.classification_id == classification_id);
  const classification_name = targetClassification ? targetClassification.classification_name : 'Unknown';

  // 2. Check if the classification contains vehicles using the new model function
  const invCount = await invModel.getInventoryCountByClassificationId(classification_id)

  if (invCount > 0) {
    // Fails validation: redirect and show error
    req.flash("notice", `Classification "${classification_name}" still contains ${invCount} vehicle(s) and cannot be deleted.`)
    return res.redirect("/inv/")
  }

  // 3. Delete the classification
  const deleteResult = await invModel.deleteClassification(classification_id)

  if (deleteResult.rowCount > 0) {
    // Success: redirect and show success message
    req.flash("notice", `Classification "${classification_name}" was successfully deleted. The navigation bar will update on next load.`)
    res.redirect("/inv/") 
  } else {
    // Failure: redirect and show error
    req.flash("notice", `Sorry, the classification deletion failed for "${classification_name}".`)
    res.status(501).redirect("/inv/")
  }
}


module.exports = invCont