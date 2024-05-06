const express=require('express');
const router=express.Router();
const catchAsync=require('../utility/catchAsync');
const Campground=require('../models/campground');
const ExpressError=require('../utility/ExpressError');
const {campgroundSchema}=require('../Schema');

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
if(error){
    const msg=error.details.map(ele=>(ele.message)).join(',');
    throw new ExpressError(msg,400);
}else
next();
}
router.get('/', catchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))
router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
})
router.get('/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground);
    if(!campground){
        req.flash('error','Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))
router.post('/',validateCampground,catchAsync(async(req,res,next)=>{
    // if(!req.body.campground)throw new ExpressError("Invalid Campground",400);
    const campgrounds=new Campground(req.body.campground);
    const {_id}=await campgrounds.save();
    req.flash('success',"Succesfully made new campground");
    res.redirect(`/campgrounds/${_id}`);
   
}))
router.get('/:id/edit',catchAsync(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',validateCampground,catchAsync(async(req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    req.flash('success',"Succesfully updated campground");
    res.redirect(`/campgrounds/${req.params.id}`);
}))
router.delete('/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}))
module.exports=router;