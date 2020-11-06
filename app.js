const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const router = express.Router();
const app = express();
const mongoose  = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');

require('./config/passport')(passport); // passport local strategy 

// db connection
mongoose.connect("mongodb+srv://dbAdmin:WB0lusQSx1N7FlKw@cluster0.jr0az.mongodb.net/test?retryWrites=true&w=majority")
.then(() => console.log('MongoDb Connected...'))
.catch((err) => console.log(err));

//EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

// body parser
app.use(express.urlencoded({extended: false}));

// Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// use passport
app.use(passport.initialize());
app.use(passport.session());
// use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


// Routes
app.use('/', require('./route/index'));
app.use('/users', require('./route/users'));

app.listen(3000);