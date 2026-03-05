import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try{
       const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); 
       console.log(`MongoDB connected: ${connection.connection.host}`);   

    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}
export default connectDB;