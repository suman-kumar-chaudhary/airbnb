const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//  ROUTER.ROUTE METHOD CHAINING
router
  .route("/")
  .get(listingController.index)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    listingController.createListing
  );

router.get("/new", isLoggedIn, listingController.newListing);
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);
module.exports = router;
