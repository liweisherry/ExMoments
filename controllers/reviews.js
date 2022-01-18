const Moment = require("../models/moment");
const Review = require("../models/review");
module.exports.createReview = async (req, res, next)=>{
    const moment = await Moment.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    moment.reviews.push(review);
    await review.save();
    await moment.save();
    req.flash('success', 'Created a new review!')
    res.redirect(`/moments/${moment._id}`);
}

module.exports.deleteReview = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    await  Moment.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await  Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/moments/${id}`);
}