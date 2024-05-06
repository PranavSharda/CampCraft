const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground')
mongoose.connect('mongodb://127.0.0.1:27017/Camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
console.log(cities.length);
const sample=arr=>(arr[Math.floor(Math.random()*arr.length)]);
const seedDb=async()=>{
    await Campground.deleteMany();
    for(let i=0;i<50;i++){
        const random213=Math.floor(Math.random()*213);
        const price=Math.floor(Math.random()*800)+600;
       const camp= new Campground({
            location:`${cities[random213].City},${cities[random213].State}`,
            title:`${sample(places)} ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam dicta dolorem illo esse ducimus fugiat corporis, deleniti impedit repellat eius similique ut est temporibus labore enim optio minima provident! Deserunt?`,
            price:price,
        })
        await camp.save();
    }
}
seedDb().then(()=>mongoose.connection.close());