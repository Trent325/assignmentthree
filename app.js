const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongooese = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


const app = express();

//passport config
require('./config/passport')(passport);

//DB Config yurd
const db = require('./config/keys').MongoURI;

//connect to mongo
mongooese.connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
    
    .then(()=>console.log("connected DB yurd"))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser

app.use(express.urlencoded({extended: false}));

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    
  }));

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global var

app.use((req, res, next)=>{
    res.locals.sucess_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = 3000;

app.listen(PORT, console.log(`server started on ${PORT}`));
