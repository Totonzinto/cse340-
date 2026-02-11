const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const nav = await utilities.getNav()

  if (!data || data.length === 0) {
    return res.render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">Sorry, no vehicles found in this classification.</p>'
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await invModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

/* ****************************************
 *  Process intentional error
 *  Assignment 3, Task 3
 * ************************************ */
invCont.throwError = async function (req, res) {
  throw new Error("I made this error on purpose")
}


/* ****************************************
 * Inventory Management View
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

// Add classification view
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null, 
  })
}


// Process add classification
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("success", "Classification added successfully.")


    const nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash()
    })
  } else {
    req.flash("error", "Failed to add classification.")

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      messages: req.flash()
    })
  }
}


// Add inventory view
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    messages: req.flash(),
    errors: null
  })
}

// Process add inventory
invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.addInventory({
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  })

  if (result) {
    req.flash("success", "Vehicle added successfully.")

    const nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash()
    })
  } else {
    res.render("inventory/add-inventory", {
  title: "Add Inventory",
  nav: await utilities.getNav(),
  classificationList: await utilities.buildClassificationList(classification_id),
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_miles,
  inv_color,
  messages: req.flash(),
  errors: null
})
  }
}

  module.exports = invCont