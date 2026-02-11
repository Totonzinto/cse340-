const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")


const Util = {}





/* ************************


 * Constructs the nav HTML unordered list


 ************************** */


Util.getNav = async function (req, res, next) {


  let data = await invModel.getClassifications()


  let list = "<ul>"


  list += '<li><a href="/" title="Home page">Home</a></li>'


  data.rows.forEach((row) => {


    list += "<li>"


    list +=


      '<a href="/inv/type/' +


      row.classification_id +


      '" title="See our inventory of ' +


      row.classification_name +


      ' vehicles">' +


      row.classification_name +


      "</a>"


    list += "</li>"


  })


  list += "</ul>"


  return list


}








/* **************************************


* Build the classification view HTML


* ************************************ */


Util.buildClassificationGrid = async function(data){


    let grid


    if(data.length > 0){


      grid = '<ul id="inv-display">'


      data.forEach(vehicle => { 


        grid += '<li>'


        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 


        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 


        + 'details"><img src="' + vehicle.inv_thumbnail 


        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 


        +' on CSE Motors" /></a>'


        grid += '<div class="namePrice">'


        grid += '<hr />'


        grid += '<h2>'


        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 


        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 


        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'


        grid += '</h2>'


        grid += '<span>$' 


        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'


        grid += '</div>'


        grid += '</li>'


      })


      grid += '</ul>'


    } else { 


      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'


    }


    return grid


  }


/* ****************************************
 * Build the vehicle detail HTML
 * Assignment 3, Task 1
 **************************************** */
Util.buildSingleVehicleDisplay = async (vehicle) => {
  let svd = '<section id="vehicle-display">'
  svd += "<div>"
  svd += '<section class="imagePrice">'
  svd +=
    "<img src='" +
    vehicle.inv_image +
    "' alt='Image of " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " on cse motors' id='mainImage'>"
  svd += "</section>"
  svd += '<section class="vehicleDetail">'
  svd += "<h3> " + vehicle.inv_make + " " + vehicle.inv_model + " Details</h3>"
  svd += '<ul id="vehicle-details">'
  svd +=
    "<li><h4>Price: $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</h4></li>"
  svd += "<li><h4>Description:</h4> " + vehicle.inv_description + "</li>"
  svd += "<li><h4>Color:</h4> " + vehicle.inv_color + "</li>"
  svd +=
    "<li><h4>Miles:</h4> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>"
  svd += "</ul>"
  svd += "</section>"
  svd += "</div>"
  svd += "</section>"
  return svd
}






/* ****************************************


 * Middleware For Handling Errors


 * Wrap other function in this for 


 * General Error Handling


 **************************************** */


Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters.")
  ]
}


async function checkClassificationData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", "Please correct the errors below.")
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: await Util.getNav(),
      errors: errors.array(),
      messages: req.flash(),
    })
  }
  next()
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classification_id" required>'
  list += '<option value="">Choose a Classification</option>'

  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}"`

    if (classification_id != null && row.classification_id == classification_id) {
      list += " selected"
    }

    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}



// Validation rules for inventory form
function inventoryRules() {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Valid year required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Valid price required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Valid miles required."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ]
}

async function checkInventoryData(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await Util.getNav()
    const classificationList = await Util.buildClassificationList(req.body.classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      messages: req.flash()
    })
  }

  next()
}


module.exports = { ...Util, classificationRules, checkClassificationData, inventoryRules, checkInventoryData,}