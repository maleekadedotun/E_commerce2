import mongoose from "mongoose";

const dbConnect = async () => {
    // console.log(dbConnect,"working");
    
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL)
        
        console.log(`Mongodb connected ${ connected.connection.host}`);
        
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
        
    }
}

export default dbConnect;

// Nodejs-ecommerce-API-password

