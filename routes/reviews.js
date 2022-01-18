// Add a review under a moment
const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Moment = require("../models/moment");
const Review = require("../models/review");
const router = express.Router({mergeParams: true});
const {reviewSchema} = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const flash = require('connect-flash');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router