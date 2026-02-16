// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

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
  utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))


// Add classification view
router.get(
  "/add-classification",
  utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

// Process add classification
router.post(
  "/add-classification",
  utilities.checkAccountType,
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process add inventory
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


/* ******************************
 * Process Inventory Update
 * ***************************** */
router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(), 
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/* ******************************
 * Deliver Delete Confirmation View
 * ***************************** */
router.get(
  "/delete/:inv_id", 
  utilities.checkAccountType, utilities.handleErrors(invController.deleteConfirmationView))

/* ******************************
 * Process Inventory Delete
 * ***************************** */
router.post(
  "/delete/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteItem)
)


// Build inventory items based on classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


/* ******************************
 * Deliver Edit Inventory View
 * ***************************** */
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))



module.exports = router;