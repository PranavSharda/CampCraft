const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');

const campgroundSchema=new Schema({
    title:{
       type:String,
    },price:{
        type:Number,
    },description:{
        type:String,
    },location:{
        type:String,
    },image:{
        type:String
    },reviews:[{
    type:Schema.Types.ObjectId,
    ref:'Review'
    }]
})
campgroundSchema.post('findOneAndDelete',async function(data){
    if(data){
        await Review.deleteMany({
            _id:{
            $in:data.reviews
        }
    })
    }
})
module.exports=mongoose.model('CampGround',campgroundSchema);