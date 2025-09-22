import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoute.js";
import Stripe from "stripe"
import { globalErrHandler, notFound } from "../middleWears/globalErrHandler.js";
import productRouter from "../routes/productRoute.js";
import categoriesRouter from "../routes/categoriesRoute.js";
import brandRoutes from "../routes/brandsRoute.js";
import colorRoutes from "../routes/colorRoutes.js";
import ReviewRoutes from "../routes/reviewsRoute.js";
import orderRoutes from "../routes/ordersRoute.js";
import Order from "../models/Order.js";
import couponRoutes from "../routes/couponRoutes.js";


//db Connect
dbConnect();
const app = express();

// app.use(cors({
//   origin: "http://localhost:3000",   // your frontend
//   credentials: true,
// }));

// db Connect
// dbConnect();
// const app = express();

// CORS setup (put this here, before your routes)
// const allowedOrigins = [
//   "http://localhost:3000",                 
//   "https://mern-stack-e-commerce-nhir.onrender.com", 
//   "https://your-frontend.netlify.app" // <-- replace with your real frontend Netlify URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `CORS policy error: This origin is not allowed - ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
// }));


// cors
app.use(cors());


app.get("/", (req, res) => {
  res.send("API is running...");
});


// Stripe webHook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_596e17a06c67a1abe923eecc0a881b6018f4ad8b7915b992b552ba04aac03102";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // console.log(event);
    
    
  } 
  catch (err) {
    // console.log("event", err.message);
    
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    // update the order
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
      },
      {
        new: true
      } 
    );
    // console.log(order);
    
    
  }
  else{
    return;
  }

  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // // Return a 200 response to acknowledge receipt of the event
  // response.send();
});

// pass incoming data
app.use(express.json())

// middleWear Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/reviews", ReviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);


// app.listen(4242, () => console.log('Running on port 4242'));
// err middleWear 
app.use(notFound);
app.use(globalErrHandler);

//   npm run server to start sever.
export default app;