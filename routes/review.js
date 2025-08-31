const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/asyncWrap.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {
  isLoggedIn,
  inReviewAuthor,
  validateReview,
} = require("../middleware.js");

const ReviewController = require("../controllers/reviews.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  inReviewAuthor,
  wrapAsync(ReviewController.deleteReview)
);

module.exports = router;
