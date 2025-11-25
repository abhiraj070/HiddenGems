import { app } from "./app.js";
import dotenv from 'dotenv';
import db_connect from "./db/dbconnect.js";

dotenv.config({
    path: ".env"
})

db_connect()
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`the server is connected on port: ${process.env.PORT}`);
        })
    })
    .catch((error)=>{
        console.log("error occured");
        throw error
    })