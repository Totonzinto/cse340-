// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", 
utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 * Assignment 3, Task 3
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.throwError)
)

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)


// Add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add classification
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process add inventory
router.post(
  "/add-inventory",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;