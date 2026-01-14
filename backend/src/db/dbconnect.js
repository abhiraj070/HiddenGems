import mongoose from 'mongoose'

const db_connect=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("mongodb_string:",process.env.MONGODB_URI);
        console.log("db is connected");
        console.log("Connected DB:", mongoose.connection.name)
        console.log("Connected Host:", mongoose.connection.host)

    } catch (error) {
        console.log("MONGODB connection error ",error);
        process.exit(1)
    }
}

export default db_connect