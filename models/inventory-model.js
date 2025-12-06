const pool = require("../database/")

/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  } catch (error) {
    console.error("getClassifications error " + error)
    return { rows: [] } 
  }
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}

/* ***************************
 * Add classification_name to data
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id"
    const data = await pool.query(sql, [classification_name])
    return data
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Adding vehicle to inventory
 * ************************** */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
       inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error: " + error.message)
    throw new Error("Delete Inventory Failed")
  }
}

/* ***************************
 * Check if a classification has inventory (NEW)
 * ************************** */
async function getInventoryCountByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT COUNT(*) FROM public.inventory WHERE classification_id = $1`,
      [classification_id]
    )
    return parseInt(data.rows[0].count)
  } catch (error) {
    console.error("getInventoryCountByClassificationId error " + error)
    return 0 
  }
}

/* ***************************
 * Delete Classification (NEW)
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    const sql = 'DELETE FROM classification WHERE classification_id = $1'
    const data = await pool.query(sql, [classification_id])
    return data
  } catch (error) {
    throw new Error("Delete Classification Failed: " + error.message)
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  addClassification,
  checkExistingClassification,
  addInventory,
  deleteInventoryItem,
  getInventoryCountByClassificationId, // <-- NEW
  deleteClassification // <-- NEW
}