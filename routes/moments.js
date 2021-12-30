const express = require('express');
const Moment = require("../models/moment");
const catchAsync = require("../utils/catchAsync");
const {momentSchema} = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const flash = require('connect-flash');

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

router.get('/', async (req, res) => {
    const Moments = await Moment.find({})
    res.render('Moments/index', {Moments})
})

// Add a new moment
router.get('/new', async (req, res) => {
    res.render('Moments/new');
})

// Show all Moments
router.post('/', validateMoment, catchAsync(async (req, res, next) => {

    const moment = new Moment(req.body.moment);
    await moment.save();
    req.flash('success', 'Successfully made a new moment')
    res.redirect(`/Moments/${moment._id}`);
}))

// Show one specific moment
router.get('/:id',  catchAsync(async (req, res) => {
    const moment = await Moment.findById(req.params.id).populate('reviews');
    if(!moment){
        req.flash('error', 'Can not find that moment');
        return res.redirect('/Moments')
    }
    res.render('Moments/show', {moment});
}))

// Edit existing Moments
router.get('/:id/edit', catchAsync( async (req, res) => {
    const moment = await Moment.findById(req.params.id)
    if(!moment){
        req.flash('error', 'Can not find that moment');
        return res.redirect('/Moments')
    }
    res.render('Moments/edit', {moment});
}))
router.put('/:id/edit', validateMoment, catchAsync(async (req, res) => {
    const {id} = req.params;
    const moment = await Moment.findByIdAndUpdate(id, {...req.body.moment});
    req.flash('success', 'Successfully updated moment!')
    res.redirect(`/Moments/${moment._id}`);
}))

// Delete a moment
router.delete('/:id',  catchAsync(async (req, res) => {
    const {id} = req.params;
    await Moment.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a moment!')
    res.redirect(`/Moments`);
}))

module.exports = router;