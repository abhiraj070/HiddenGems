import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))

app.use(cookieParser())
app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"})) //used for recivind form-data and then inserting it into body so that we can access it
app.use(express.static("public"))




//route imports
import userRouter from './routes/user.route.js'

//route decleration
app.use("/api/v1/users",userRouter)



export { app }

