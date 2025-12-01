//import dotenv from 'dotenv'
// dotenv.config({ path: ".env" }) 
//we do not nee to import dotenv as it is do by the dev script in package.json

import  db_connect  from "./db/dbconnect.js"
import {app } from "./app.js"

db_connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`the server is connected on port: ${process.env.PORT}`)
        });
    })
    .catch((error) => {
        console.log("error occured")
        throw error;
    })