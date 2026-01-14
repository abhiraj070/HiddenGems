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

app.use('/api/v1', (req, res, next) => {
    console.log(`API Middleware: ${req.method} ${req.path}`);
    console.log(`API Middleware: Headers:`, req.headers);
    console.log(`API Middleware: Body:`, req.body);
    next();
});

app.disable("etag");


//route imports
import userRouter from './routes/user.route.js'
import reviewRouter from './routes/review.route.js'
import spotRouter from './routes/spot.route.js'

//route decleration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/review",reviewRouter)
app.use("/api/v1/spot",spotRouter)

// error handler
app.use((err, req, res, next) => {
    console.error('Error handler: Error occurred:', err.message);
    console.error('Error handler: Stack:', err.stack);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    console.log('Error handler: Sending response with status:', statusCode, 'message:', message);
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export { app }