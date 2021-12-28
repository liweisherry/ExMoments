const express = require('express');
const mongoose = require('mongoose');
const Moment = require('./models/moment');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require('method-override');
const Review = require('./models/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected")
});
const app = express();
const path = require('path')
const {momentSchema, reviewSchema} = require("./schemas");

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
// Middleware application
const validateMoment = (req, res, next) =>{
    // if(!req.body.moment) throw new ExpressError('Invalid Moment Data', 400);

    const {error} = momentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}

const validateReview =(req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/Moments', async (req, res) => {
    const Moments = await Moment.find({})
    res.render('Moments/index', {Moments})
})

// Add a new moment
app.get('/Moments/new', async (req, res) => {
    res.render('Moments/new');
})

// Show all Moments
app.post('/Moments', validateMoment, catchAsync(async (req, res, next) => {

    const moment = new Moment(req.body.moment);
    await moment.save();
    res.redirect(`/Moments/${moment._id}`);
}))

// Show one specific moment
app.get('/Moments/:id',  catchAsync(async (req, res) => {
    const moment = await Moment.findById(req.params.id).populate('reviews');
    res.render('Moments/show', {moment});
}))

// Edit existing Moments
app.get('/Moments/:id/edit', catchAsync( async (req, res) => {
    const moment = await Moment.findById(req.params.id)
    res.render('Moments/edit', {moment});
}))
app.put('/Moments/:id', validateMoment, catchAsync(async (req, res) => {
    const {id} = req.params;
    const moment = await Moment.findByIdAndUpdate(id, {...req.body.moment});
    res.redirect(`/Moments/${moment._id}`);
}))

// Delete a moment
app.delete('/Moments/:id',  catchAsync(async (req, res) => {
    const {id} = req.params;
    const moment = await Moment.findByIdAndDelete(id);
    res.redirect(`/Moments`);
}))

// Add a review under a moment
app.post('/Moments/:id/reviews', validateReview, catchAsync(async (req,res,next)=>{
    const moment = await Moment.findById(req.params.id);
    const review = new Review(req.body.review);
    moment.reviews.push(review);
    await review.save();
    await moment.save();
    res.redirect(`/Moments/${moment._id}`);
}
))

// Delete a review
app.delete('/Moments/:id/reviews/:reviewId', catchAsync(async(req,res,next)=>{
    const {id, reviewId} = req.params;
    await  Moment.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await  Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/Moments/${id}`);
}))

app.all('*', (req, res,next) =>{
    next(new ExpressError('Page Not Found', 404))
})

// error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = " Something went wrong";
        res.status(statusCode).render('error', {err});

})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})