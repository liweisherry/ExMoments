const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review')
const Momentschema = new Schema({

    title: String,
    image: String,
    expense: Number,
    description: String,
    location: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }]
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