import { Server } from "http";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

const app = express();


// now route for server
app.get("/",(req: Request, res: Response)=>{
    res.status(200).json({
        message: "Welcome to Ride Booking System"
    })
})

export default app;