/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv"
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

dotenv.config()

let server: Server;



const startServer = async () => {
    try {
       
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to DB");

        server = app.listen(envVars.PORT, () => {
            console.log(`Ride Booking Server is listening to port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

// startServer();
(
    async()=>{
        await startServer()
        await seedSuperAdmin()
    }
)()

//unhandled rejection error, to prevent server crash/ gracefully shutdown
process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection detected ... Server is shutting down", err);
    if(server){
        server.close(()=>{
            process.exit(1)
    })
    }
    process.exit(1)
})

// Promise.reject(new Error("I forgot to catch this promise"))

//uncaught rejection error // not connected with promise // some local problem, unknown var, other symbol
process.on("uncaughtException", (err)=>{
    console.log("Uncaught Exception detected ... Server is shutting down", err);
     if(server){
        server.close(()=>{
            process.exit(1)
    })
    }
    process.exit(1)
})

// throw new Error("I forgot to handle this local error")

//signal termination sigterm
process.on("SIGTERM", (err)=>{
    console.log("SIGTERM signal received ... Server is shutting down", err);
     if(server){
        server.close(()=>{
            process.exit(1)
    })
    }
    process.exit(1)
})

//for manual shutdown
process.on("SIGINT", (err)=>{
    console.log("SIGINT signal received ... Server is shutting down", err);
     if(server){
        server.close(()=>{
            process.exit(1)
    })
    }
    process.exit(1)
})

