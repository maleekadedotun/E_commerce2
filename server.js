import http from "http";

import app from "./app/app.js";
import mongoose from "mongoose";


// mongoose
//   .connect("mongodb+srv://NodeJs-ecommerce-API:Nodejs-ecommerce-API-password@nodejs-ecommerce-api-v1.zkwq1.mongodb.net/NodeJs-ecommerce-API?retryWrites=true&w=majority&appName=NodeJs-ecommerce-API-v1")
//   .then(() => console.log("DB Connection Successfull!"))
//   .catch((err) => {
//     console.log(err);
// });


// create the server
const PORT = process.env.PORT || 7000;
const server = http.createServer(app)
server.listen(PORT, console.log(`server is up and running on port ${PORT}`))
