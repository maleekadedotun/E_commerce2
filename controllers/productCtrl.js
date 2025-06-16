import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";


// @desc create new product
// @route POST/api/v1/products
// @access Private/admin

export const createProductCtrl = asyncHandler(async (req, res) =>{ 
    // console.log("Receive image",req.files); 
   

const convertedImages = req.files.map(file => file.path);

    
    const {name, description,category, sizes, colors, price, totalQty, brand} = req.body
    // products exist
    const productExits = await Product.findOne({name})
    if (productExits) {
        throw new Error("Product already exist");
    }

    // find the category
    const categoryFound = await  Category.findOne({name: category});
    if (!categoryFound) {
        throw new Error("Category not found, please create category first or check category name")
    }

    // find the brand
    const brandFound = await  Brand.findOne({
        name: brand?.toLowerCase(),
    });
    if (!brandFound) {
        throw new Error("Brand not found, please create brand first or check brand name")
    }
    // create product
    const product = await Product.create({
        name, 
        description,
        category, 
        sizes, 
        colors, 
        user: req.userAuthId, 
        price, 
        totalQty,
        brand,
        images: convertedImages,
    })
    // push the product into category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();

    // push the product into brand
    brandFound.products.push(product._id);
    // resave
    await brandFound.save();
    
    res.json({
        msg: "Success",
        status: "Product created successfully",
        product,
    })
});

// @desc Get all products
// @route GET/api/v1/products
// @access Public

export const getProductsCtrl = asyncHandler(async (req, res) =>{
    // console.log(req.query);
    
    // Query
    let productQuery = Product.find();
   
    // Search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name:{$regex: req.query.name, $options: "i"},
        })
    }    

    // filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand:{$regex: req.query.brand, $options: "i"},
        })
    }  

    // filter by colors
    if (req.query.colors) {
        productQuery = productQuery.find({
            colors:{$regex: req.query.colors, $options: "i"},
        })
    } 

    // filter by sizes
    if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes:{$regex: req.query.sizes, $options: "i"},
        })
    }

    // filter price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-")
        //gte: greater than or equal to
        //lte: less than or equal to
        productQuery = productQuery.find({
            price:{$gte: priceRange[0], $lte: priceRange[1]},
        })
        // console.log(priceRange);
        
        
    }
    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIndex = (page -1) * limit ;
    //endIdx
    const endIndex = page * limit;
    //total
    const total = await Product.countDocuments()

    productQuery =productQuery.skip(startIndex).limit(limit)

    const pagination ={}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }
    
    // await the Query
     const  products = await productQuery
    res.json({
        status: "Success",
        total,
        results: products.length,
        pagination,
        message: "Product fetched successfully",
        products,
    })
});

// @desc Get single products
// @route GET/api/v1/:id
// @access Public

export const getProductCtrl = asyncHandler(async (req, res) =>{
    // console.log(req.params);
    
    const product = await Product.findById(req.params.id).populate("reviews")
    if (!product) {
        throw new Error("Product not found")
    }
    res.json({
        status: "Success",
        message: "Product fetch successfully",
        product,
    })
});


// @desc Update single products
// @route Put/api/v1/:id
// @access Public

export const getProductUpdateCtrl = asyncHandler(async (req, res) =>{
    const {name, description,category, sizes, colors, user, price, totalQty, brand} = req.body
   const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,{
            name, 
            description,
            category, 
            sizes, 
            colors, 
            user, 
            price, 
            totalQty, 
            brand,
        }, 
        {
            new: true
        }
    );
   if (!updateProduct) {
    throw new Error("Product not updated")
   }
    res.json({
        status: "Success",
        message: "Product updated successfully",
        updateProduct,
    })
});

export const getProductDeleteCtrl = asyncHandler(async (req, res) =>{
    const product = await Product.findByIdAndDelete(req.params.id)
    res.json({
        status: "Success",
        message: "Product deleted successfully",
    })
});


