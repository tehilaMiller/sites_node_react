const mongoose = require('mongoose')

main().catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ATIDA2025')
    console.log("mongo connect");
}