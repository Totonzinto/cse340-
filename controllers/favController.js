const favModel = require("../models/favorite-model")
const utilities = require("../utilities/")

const favCont = {}

/* ****************************************
* Deliver Favorites View
* *************************************** */
favCont.buildFavoritesView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const data = await favModel.getFavoritesByAccountId(account_id)
  
  res.render("account/favorites", {
    title: "My Favorite Vehicles",
    nav,
    errors: null,
    data,
  })
}

/* ****************************************
* Process Add Favorite
* *************************************** */
favCont.addFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  const result = await favModel.addFavorite(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle added to your favorites list.")
    res.redirect("/account/favorites")
  } else {
    req.flash("notice", "Sorry, there was an error adding the favorite.")
    res.redirect("/inv/detail/" + inv_id)
  }
}





module.exports = favCont