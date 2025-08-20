import { Server } from "http";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv"

dotenv.config()

let server: Server;



const startServer = async () => {
    try {
        if (!process.env.DB_URL) {
            throw new Error("❌ DB_URL is not defined in .env");
        }
        await mongoose.connect(process.env.DB_URL)

        console.log("Connected to DB");

        server = app.listen(5000, () => {
            console.log("Ride Booking Server is listening to port 5000");
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();


