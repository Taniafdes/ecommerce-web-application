import asyncHandler from 'express-async-handler'
import Product from '../model/Product.js';
import Categories from '../model/Categories.js';
import Brands from '../model/Brands.js';

// @desc  add new product
// @route POST /api/v1/products
// @access private/admin

export const newProductCtrl = asyncHandler( async (req, res) => {
    

    console.log("hi");
  console.log("👉 File uploaded:", req.file);
  console.log("👉 Body received:", req.body);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.json({
    message: "Product received successfully",
    file: req.file,
    body: req.body,
  });


//     const { name, description, category, sizes, colors, price, totalQlty, brand } = req.body;

//     const productExists = await Product.findOne({ name })

//     if (productExists) {
//         throw new Error("Product already exists");
//     }

//    console.log("Category from request:", category);

// const categoryFound = await Categories.findOne({
//   name: category?.toLowerCase()
// });

// if (!categoryFound) {
//   throw new Error("Category not found");
// }

//     const brandFound = await Brands.findOne({
//         name: brand?.toLowerCase()
//     })

//     if(!brandFound) {
//         throw new Error("Brand not found")
//     }


//     const createProduct = await Product.create({
//         name,
//         description,
//         category,
//         sizes,
//         colors,
//         user: req.userAuthId,
//         price,
//         brand,
//         totalQlty
//     });

//     categoryFound.products.push(createProduct._id);

//     await categoryFound.save();

//     brandFound.products.push(createProduct._id);

//     await brandFound.save();


//     res.json({
//         status: "Success",
//         msg: "Product Successsfully Added",
//         createProduct
//     })

}
);

// @desc  add all products
// @route POST /api/v1/products
// @access public

export const getAllProductsCtrl = asyncHandler( async (req, res) => {

    let productQuery = Product.find()
    // filter by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" },
        });
    }
    // fileter by brand 
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" },
        });
    }
    // filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" },
        });
    }
    // filetr by color
     if (req.query.color) {
        productQuery = productQuery.find({
            color: { $regex: req.query.color, $options: "i" },
        });
    }

    // filetr by size
     if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.sizes, $options: "i" },
        });
    }

    // splitting the price range
    if (req.query.price) {
        const priceQuery = req.query.price.split(" - ")

        productQuery = productQuery.find({
            price: {$gte: priceQuery[0], $lte: priceQuery[1]}
        })
        console.log('price', priceQuery);
        
    }

    // pagination

    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    const pagination = {}
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }

    productQuery = productQuery.skip(startIndex).limit(limit);

    const products = await productQuery.populate('reviews');
    res.json({
        msg: "Products fetched",
        results: products.length,
        pagination,
        products
    })

});

export const getSingleProductCtrl = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');
    
    if(!product) {
        throw new Error("No product found")
    }
    res.json({
        msg: "New product added",
        product
    })
});

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, user, price, totalQlty, brand   } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
     name, description, category, sizes, colors, user, price, totalQlty, brand 
    },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    msg: "Product updated successfully",
    product,
  });
});

export const deleteProductCtrl = asyncHandler( async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
        status: "success",
        msg: "Product deleted successfully",
    })
});