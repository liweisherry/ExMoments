// Add a review under a moment
const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Moment = require("../models/moment");
const Review = require("../models/review");
const router = express.Router();
const {reviewSchema} = require("../schemas");
const ExpressError = require("../utils/ExpressError");


const validateReview =(req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res, next)=>{
        const moment = await Moment.findById(req.params.id);
        const review = new Review(req.body.review);
        moment.Review.push(review);
        await review.save();
        await moment.save();
        req.flash('success', 'Created a new review!')
        res.redirect(`/Moments/${moment._id}`);
    }
))

// Delete a review
router.delete('/:reviewId', catchAsync(async(req,res,next)=>{
    const {id, reviewId} = req.params;
    await  Moment.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await  Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/Moments/${id}`);
}))

module.exports = router