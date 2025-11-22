const pool = require("../database/")

//Register new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    console.error("Database error in registerAccount:", error.message) 
    throw new Error("Failed to register account: " + error.message)
  }
}

// Check for existing email
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    return result.rowCount
  } catch (error) {
    console.error("Database error in checkExistingEmail:", error.message)
    throw new Error("Failed to check existing email: " + error.message)
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail
}