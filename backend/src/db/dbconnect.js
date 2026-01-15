import mongoose from 'mongoose'

const db_connect=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("db is connected");

    } catch (error) {
        console.log("MONGODB connection error ",error);
        process.exit(1)
    }
}

export default db_connect