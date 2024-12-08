const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts') 
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
require('dotenv').config()
const dotenv = require('dotenv')
const MongoDbStore = require('connect-mongo')

//Database connection
const url = 'mongodb://localhost:27017/pizza'; 
// mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
// const connection = mongoose.connection;
 //connection.once('open',()=>{
 //  console.log('Database connected...');
 //}).catch(err=>{console.log("Connection failed...")});


//dinchik
mongoose.connect('mongodb://localhost:27017/pizza', { useNewUrlParser: true, useUnifiedTopology: true });

// Event listeners for connection events
mongoose.connection.on('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

//Session Store
const mongoStore=MongoDbStore.create({
  mongoUrl: 'mongodb://localhost:27017/pizza',
  collectionName: 'sessions',
});
//Session config

 app.use(session({
   secret:process.env.COOKIE_SECRET,
   resave:false,
   store:mongoStore,
   saveUninitialized:true,
   cookie:{maxAge:1000 * 60 * 60 * 24} //24 hours
 }))

 app.use(flash())
//assets


app.use(express.static('public'))
app.use(express.json())

//Global Middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
})


app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')
require('./routes/web')(app)




app.listen(PORT, ()=>{
  // const pass = process.env.COOKIE_SECRET;
  //console.log(pass);
  console.log(`Listening on port ${PORT}`)
})