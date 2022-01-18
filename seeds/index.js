if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Moment = require('../models/moment');
const db_url =  process.env.DB_URL
mongoose.connect(db_url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Moment.deleteMany({});
    // const c = new Moment({title: 'purple field'})
    // await c.save();
    for (let i = 0; i < 5; i++) {
         const random1000 = Math.floor(Math.random() * 1000);
         const expense = Math.floor(Math.random() * 20) + 10;
         const random = Math.floor(Math.random()* 1000);
         const camp = new Moment({
    //         //YOUR USER ID
            author: '61e3b6d482adeeed3553e082',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
             title: `${sample(descriptors)} ${sample(places)}`,
             description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
             expense,
    //         geometry: {
    //             type: "Point",
    //             coordinates: [
    //                 cities[random1000].longitude,
    //                 cities[random1000].latitude,
    //             ]
    //         },
    //         images: [
    //             {
    //                 url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
    //                 filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
    //             }
    //             {
    //                 url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
    //                 filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
    //             }
    //         ]
             image: `https://source.unsplash.com/480x480/?sig=${random}`
         })
         await camp.save();
     }
}

seedDB().then(() => {
    mongoose.connection.close();
})