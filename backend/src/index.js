//import dotenv from 'dotenv'
// dotenv.config({ path: ".env" }) 
//we do not need to import dotenv as it is done by the dev script in package.json

import  db_connect  from "./db/dbconnect.js"
import {app } from "./app.js"

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error);
    process.exit(1);
});

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