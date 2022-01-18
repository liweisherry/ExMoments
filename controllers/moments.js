const Moment = require("../models/moment");
module.exports.index = async (req, res) => {
    const Moments = await Moment.find({})
    res.render('moments/index', {Moments})
}

module.exports.renderNewForm = async (req, res) => {
    res.render('moments/new');
}

module.exports.createMoment = async (req, res, next) => {

    const moment = new Moment(req.body.moment);
    moment.author = req.user._id;
    await moment.save();
    req.flash('success', 'Successfully made a new moment')
    res.redirect(`/moments/${moment._id}`);
}

module.exports.showMoments = async (req, res) => {
    const moment = await Moment.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    console.log(moment)
    if(!moment){
        req.flash('error', 'Can not find that moment');
        return res.redirect('/moments')
    }
    res.render('moments/show', {moment});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const moment = await Moment.findById(id)
    if(!moment){
        req.flash('error', 'Can not find that moment');
        return res.redirect('/moments')
    }
    res.render('moments/edit', {moment});
}

module.exports.editForm = async (req, res) => {
    const {id} = req.params;
    const moment = await Moment.findByIdAndUpdate(id, {...req.body.moment});
    req.flash('success', 'Successfully updated moment!')
    res.redirect(`/moments/${moment._id}`);
}

module.exports.deleteForm = async (req, res) => {
    const {id} = req.params;
    await Moment.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a moment!')
    res.redirect(`/moments`);
}