import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utilis/generateToken.js";
import { getTokenFromHeader } from "../utilis/getTokenFromHeader.js";
import { verifyToken } from "../utilis/verifyToken.js";

//@desc  Register user
//@route  POST /api/v1/users/register
//@access  Private/Admin

export const registerUserCtrl = asyncHandler(
    async (req, res) =>{
        // console.log("LOGIN BODY:", req.body);
        const {fullname, email, password} = req.body;
        // check if user exists
        const userExists = await User.findOne({email});
        if (userExists) {
            // throw
            throw new Error("User already exists.")
        }
    
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
        // create the user
        const user = await User.create({
            fullname,
            email,
            password: hashPassword,
        });
        res.status(201).json({
            status: "Success",
            msg: "User Registered Successfully",
            data: user,
        });
    }
);

//@desc  LOgin user
//@route  POST /api/v1/users/register
//@access  Public
export const loginUserCtrl = asyncHandler(
    async (req, res) =>{
        //   console.log("LOGIN BODY:", req.body);
        const {email, password} = req.body;
        // find the user in db by email only
        const userFound = await User.findOne({
            email,
        })
        if(userFound && (await bcrypt.compare(password, userFound?.password))){
            res.json({
                status: "success",
                message: "User logged in successfully",
                userFound: {
                    userFound: userFound?.fullname,
                    isAdmin: userFound?.isAdmin,
                },
                token: generateToken(userFound._id)
            });
        }
        else{
           throw new Error("Invalid login credentails");
        }
    }
);

//@desc   userProfile
//@route  Get /api/v1/users/register
//@access  Private
export const getUserProfileCtrl = asyncHandler(async(req, res) =>{
    //  console.log(req.body, "profile");
    console.log("UserAuthId:", req.userAuthId);   
    // find the user
    const user = await User.findById(req.userAuthId).populate("orders")
    console.log(user, "user");
    
    // get token from header
    const token = getTokenFromHeader(req)
    // console.log(token);
    
    // verify token
    const verified = verifyToken(token)
    // console.log(req);
    
    res.json({
        status: "Success",
        msg: "User profile fetched successfully",
        user,
    })
});

// export const getUserProfileCtrl = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.userAuthId).populate("orders");

//   if (!user) {
//     return res.status(404).json({
//       status: "Fail",
//       msg: "User not found",
//     });
//   }

//   res.json({
//     status: "Success",
//     msg: "User profile fetched successfully",
//     user,
//   });
// });



//@desc   userAddress
//@route  Get /api/v1/users/updateShippingAddress
//@access  Private

export const updateShippingAddressCtrl = asyncHandler(async(req, res) =>{
    // console.log(req.body, "shippingAddress");
    // console.log("UserAuthId:", req.userAuthId);   // 👈
    
    const {firstName, lastName, address,city, 
    postalCode, country,province, phoneNumber} = req.body;

    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress: {
            firstName, 
            lastName, 
            address,city, 
            postalCode, 
            country,
            province, 
            phoneNumber,
        },
        hasShippingAddress: true,
    },
    {
        new: true,
    }    
    )
        res.json({
        status: "Success",   
        msg: "User shipping address updated successfully",
        user,
    })
});