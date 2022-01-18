if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Moment = require('./models/moment');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require('method-override');
const Review = require('./models/review');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const moments = require('./routes/moments');
const reviews = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const flash = require('connect-flash');
const db_url =  process.env.DB_URL
mongoose.connect(db_url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log(db_url);
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
app.use(express.static(path.join(__dirname,'public')));



const secret = process.env.SECRET || 'thisshouldbebettersecret!'
const store = new MongoStore({
    uri: db_url,
    secret,
    touchAfter: 24 * 3600
})
console.log(store)
store.on("error", function(e){
    console.log("Session store error", e)
})
const seesionConfig ={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7
    }

}
app.use(session(seesionConfig))

// flash a message for all requests
app.use(flash())
// Passport should be after session.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', userRoutes);
app.use('/moments', moments);
app.use('/moments/:id/reviews', reviews);

app.all('*', (req, res,next) =>{
    next(new ExpressError('Page Not Found', 404))
})

// error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = " Something went wrong";
    res.status(statusCode).render('error', {err});

})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})