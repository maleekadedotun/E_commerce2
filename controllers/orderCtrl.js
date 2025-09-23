import asyncHandler from "express-async-handler";
import Stripe from "stripe"
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import Coupon from "../models/Coupon.js";
// import { json } from "express";
dotenv.config();

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY)

// @desc create new order
// @route POST/api/v1/orders
// @access Private/admin

export const createOrder = asyncHandler(async(req, res) =>{
  // find the coupon
  // const {coupon} = req?.query;
  
  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });
  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon has expired");
  // }

  // if (!couponFound) {
  //   throw new Error("Coupon does not exist");
  // }

  // get discount
  // const discount = couponFound?.discount / 100;
  // Get the payload(customers, orderItems, shippingAddress, totalPrice);
  const {orderItems, shippingAddress, totalPrice } = req.body;    
  
  // find the user
  const userFound = await User.findById(req.userAuthId)
  // check if user provide shipping address
  if (!userFound.hasShippingAddress) {
    throw new Error("Please provide shipping address.")
  }
  // Check if order id not empty
  if (orderItems?.length <= 0) {        
    throw new Error("No Order Items")
  }
  
  // place/create order -- save into DB
  const order = await Order.create({
    user: userFound._id,
    shippingAddress,
    orderItems,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice
  })
  // console.log(order);
  
  // console.log(order);
  
  // push order into the user
  userFound.orders.push(order?._id);
  await userFound.save();
  // Update the product Qty
  const products = await Product.find({_id: {$in: orderItems}})

  // orderItems?.map(async (order) => {
  //   const product = products?.find((product) => {
  //     return product?._id.toString() === order?._id?.toString();
  //   });
  //   if (product) {
  //     // product.totalSold += order.qty;
  //     product.totalSold = Number(product.totalSold || 0) + Number(order.qty);
  //   }   
  //   await product.save();
  // });

  // Instead of searching through products like this, query the DB directly for each order:
  for (const order of orderItems) {
  const product = await Product.findById(order._id); // ✅ get fresh document
  if (product) {
    product.totalSold = Number(product.totalSold || 0) + Number(order.qty);
    await product.save(); // ✅ works now
  }
}
    
  // Make payment (Stripe)
  // Converted order items to have same structure that stripe needs.
  const convertedOrders = orderItems.map((item) =>{
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
         unit_amount: item.price *100,
      },
      quantity: item.qty,
    }
  })
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: order?._id.toString()
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",  // ✅ update here for dev
    cancel_url: "http://localhost:3000/cancel",    // ✅ update here for dev
  });

  res.send({url: session.url});
  // payment webhook
  // Update the user order
  // res.status(201).json({
  //   success: true,
  //   message: "Order Created",
  //   order,
  //   userFound,
  // });
    
      
});

// @desc all orders
// @route POST/api/v1/orders
// @access Private/admin

export const getAllOrdersCtrl = asyncHandler(async (req, res) =>{
  // find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders
  })
});

// @desc single order
// @route get/api/v1/orders/:id
// @access Private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) =>{
  // get the id from the params
  const id = req.params.id
  const order = await Order.findById(id);
  res.json({
    success: true,
    message: "Single order",
    order
  })
});

// @desc single order
// @route get/api/v1/orders/:id
// @access Private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) =>{
  // get the id from the params
  const id = req.params.id
  const updateOrder =  await Order.findByIdAndUpdate(id, {
    status: req.body.status
  },
  {
    new: true
  }
  );
  res.json({
    success: true,
    msg: "Order updated successfully",
    updateOrder
  })
});

// @desc get sales sum of order
// @route POST/api/v1/orders/sales/sum
// @access Private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {

  // get the order statistic
  const orders = await Order.aggregate([
    {
      $group: {
        _id : null,
       minimumSale: {
         $min : "$totalPrice",
       },
        totalSales: {
          $sum : "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
         avgSale: {
          $avg: "$totalPrice",
        }
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte : today,
        },
      },
    },
    {
      $group: {
        _id : null,
        totalSale: {
          $sum : "$totalPrice"
        },
      },
    },
  ])
  res.status(200).json({
    success : true,
    message: "Sum of orders",
    orders,
    salesToday,
  });
});
