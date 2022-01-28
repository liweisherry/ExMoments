const Moment = require("../models/moment");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder= mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const Moments = await Moment.find({})
    res.render('moments/index', {Moments})
}

module.exports.renderNewForm = async (req, res) => {
    res.render('moments/new');
}

module.exports.createMoment = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.moment.location,
        limit: 1
    }).send()
    const moment = new Moment(req.body.moment);
    moment.geometry = geoData.body.features[0].geometry;
    moment.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    moment.author = req.user._id;
    await moment.save();
    console.log(moment)
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
    console.log(req.body);
    const moment = await Moment.findByIdAndUpdate(id, {...req.body.moment});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    moment.images.push(...imgs);
    // Use cloudinary API to delete a pic
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            console.log(filename)
            await cloudinary.uploader.destroy(filename);
        }
        await moment.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(moment)
    }
    await moment.save();
    req.flash('success', 'Successfully updated moment!')
    res.redirect(`/moments/${moment._id}`);
}

module.exports.deleteForm = async (req, res) => {
    const {id} = req.params;
    await Moment.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a moment!')
    res.redirect(`/moments`);
}