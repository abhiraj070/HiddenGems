import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()
app.use(cors({
  origin: "https://hidden-gems-bpjk-jjpydgajn-abhiraj-sharmas-projects-33923310.vercel.app",
  credentials: true
}))

app.use(cookieParser())
app.use(express.json({ limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"})) //used for recivind form-data and then inserting it into body so that we can access it
app.use(express.static("public"))


//route imports
import userRouter from './routes/user.route.js'
import reviewRouter from './routes/review.route.js'
import spotRouter from './routes/spot.route.js'

//route decleration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/review",reviewRouter)
app.use("/api/v1/spot",spotRouter)

export { app }