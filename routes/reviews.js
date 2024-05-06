const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utility/catchAsync');
const Campground=require('../models/campground');
const ExpressError=require('../utility/ExpressError');
const Review=require('../models/review');
const {reviewSchema}=require('../Schema');

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(ele=>(ele.message)).join(',');
        throw new ExpressError(msg,400);
    }else
    next();
}
router.post('/',validateReview,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    const {review}=req.body;
    const newReview=new Review(review);
    // console.log(newReview);
    campground.reviews.push(newReview._id);
    // console.log(campground);
    await newReview.save();
    await campground.save();
    req.flash('success','Created new review');
    res.redirect(`/campgrounds/${id}`);
    }))
    
    router.delete('/:reviewId',catchAsync(async(req,res)=>{
        console.log("hitt");
       const {id,reviewId}=req.params;
    //    console.log("hit");
        await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash('success','Successfully deleted review');
       res.redirect(`/campgrounds/${id}`);
    }))
    module.exports=router;
    