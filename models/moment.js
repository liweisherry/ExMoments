const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url:String,
    filename: String
})

const opts = { toJSON: {virtuals: true}};
// make sure the images to become thumbnail
ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200');
})


const Momentschema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    expense: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, opts)
Momentschema.virtual('properties.popUpMarkup').get(function (){
    return `<strong><a href="/moments/${this._id}">${this.title}</a></strong>
        <p>${this.description.substr(0,30)}...</p>`
})


Momentschema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
// Creating a model for moment
module.exports = mongoose.model('Moment', Momentschema)