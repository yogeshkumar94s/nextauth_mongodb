import { error } from "console";
import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log('MongoDB connected');
        })

        connection.on('error', (error) => {
            console.log('MongoDB connection error, Please make sure db is up and running: ' + error);
            process.exit(); 
        })
        
    } catch (error) {
        console.log("Something went wrong in connecting to db");
        console.log(error);        
    }
}