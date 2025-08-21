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

//unhandled rejection error, to prevent server crash/ gracefully shutdown
process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection detected ... Server is shutting down", err);
    server.close(()=>{

    })
    process.exit(1)
})

// Promise.reject(new Error("I forgot to catch this promise"))

//uncaught rejection error // not connected with promise // some local problem, unknown var, other symbol
process.on("uncaughtException", (err)=>{
    console.log("Uncaught Exception detected ... Server is shutting down", err);
    server.close(()=>{

    })
    process.exit(1)
})

// throw new Error("I forgot to handle this local error")

//signal termination sigterm
process.on("SIGTERM", (err)=>{
    console.log("SIGTERM signal received ... Server is shutting down", err);
    server.close(()=>{

    })
    process.exit(1)
})

//for manual shutdown
process.on("SIGINT", (err)=>{
    console.log("SIGINT signal received ... Server is shutting down", err);
    server.close(()=>{

    })
    process.exit(1)
})

