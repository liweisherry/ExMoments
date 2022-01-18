const mongoose = require('mongoose');
const {number} = require("joi");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating:Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = mongoose.model('Review', ReviewSchema);
