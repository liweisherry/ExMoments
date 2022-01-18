const express = require('express');
const Moment = require("../models/moment");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const flash = require('connect-flash');
const passport = require('passport');
const {isLoggedIn, isAuthor, validateMoment} = require('../middleware');
const moments = require('../controllers/moments');


router.route('/')
    .get(catchAsync(moments.index))
    .post(isLoggedIn, validateMoment, catchAsync(moments.createMoment));

// Add a new moment
router.get('/new', isLoggedIn,moments.renderNewForm)


// Show one specific moment
router.route('/:id')
    .get( catchAsync(moments.showMoments))
    .put(isLoggedIn, isAuthor, validateMoment, catchAsync(moments.editForm))
    .delete(isLoggedIn,isAuthor, catchAsync(moments.deleteForm))

// Edit existing Moments
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( moments.renderEditForm))

module.exports = router;