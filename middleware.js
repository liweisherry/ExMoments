const {momentSchema, reviewSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Moment = require("./models/moment");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) =>{

    if(!req.isAuthenticated()){
        // store the url the user is using
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateMoment = (req, res, next) =>{
    // if(!req.body.moment) throw new ExpressError('Invalid Moment Data', 400);

    const {error} = momentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}

module.exports.isAuthor = async (req, res,next) => {
    const {id} = req.params;
    const moment = await Moment.findById(id)
    if(!moment.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/moments/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/moments/${id}`);
    }
    next();
}

module.exports.validateReview =(req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}