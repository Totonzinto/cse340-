const pool = require("../database/")

/* *****************************
* Add a new favorite
* ***************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorite (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    console.error("model error: " + error)
    return error.message
  }
}

/* *****************************
* Get all favorites for a specific account
* ***************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `SELECT f.fav_id, i.inv_make, i.inv_model, i.inv_id, i.inv_thumbnail 
                 FROM favorite f 
                 JOIN inventory i ON f.inv_id = i.inv_id 
                 WHERE f.account_id = $1 ORDER BY f.fav_date DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error " + error)
  }
}

// Check if a favorite already exists for the account and vehicle//
async function checkFavoriteExists(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM favorite WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    return error.message
  }
}


module.exports = { addFavorite, getFavoritesByAccountId, checkFavoriteExists }