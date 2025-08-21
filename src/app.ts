
import express, { Request, Response } from "express";


const app = express();


// now route for server
app.get("/",(req: Request, res: Response)=>{
    res.status(200).json({
        message: "Welcome to Ride Booking System"
    })
})

export default app;