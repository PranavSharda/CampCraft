const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const path=require('path');
const app=express();
const Campground=require('./models/campground');
const ejsMate=require('ejs-mate');
const {campgroundSchema, reviewSchema}=require('./Schema');
const ExpressError=require('./utility/ExpressError');
const catchAsync=require('./utility/catchAsync')
const Review=require('./models/review');
const session=require('express-session');
const flash=require('connect-flash');


const campgrounds=require('./routes/campground');
const reviews=require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/Camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.get('/',(req,res)=>{
    res.render('home');
})
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig={
    secret:"thisshouldbeabettersecret",
    resave:false,
    saveUninitialized :true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
res.locals.error=req.flash('error');
    next();
})
app.use('/campgrounds',campgrounds);
// reviews
app.use('/campgrounds/:id/reviews',reviews);




app.all('*',(req,res,next)=>{
    next(new ExpressError("Page not found",404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message)err.message="Something went wrong";
    res.status(statusCode).render('error',{err});
})

app.listen(3000,(req,res)=>{
    console.log("Listening to port 3000");
})