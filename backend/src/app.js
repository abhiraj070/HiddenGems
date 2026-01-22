import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))

app.use(cookieParser())
app.use(express.json({ limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"})) //used for recivind form-data and then inserting it into body so that we can access it
app.use(express.static("public"))

//route imports
import userRouter from './routes/user.route.js'
import reviewRouter from './routes/review.route.js'
import spotRouter from './routes/spot.route.js'
import likeRouter from './routes/like.route.js'
import savedSpotRouter from './routes/savedSpot.route.js'
import followRouter from './routes/follow.route.js'

//route decleration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/review",reviewRouter)
app.use("/api/v1/spot",spotRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/savedSpot",savedSpotRouter)
app.use("/api/v1/follow",followRouter)

export { app }