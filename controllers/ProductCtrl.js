import asyncHandler from 'express-async-handler'
import Product from '../model/Product.js';
import Categories from '../model/Categories.js';
import Brands from '../model/Brands.js';

// @desc  add new product
// @route POST /api/v1/products
// @access private/admin
export const newProductCtrl = asyncHandler( async (req, res) => {
    // Check if the user is authenticated and authorized (handled by middleware, but good practice to check if needed)
    if (!req.userAuthId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check for file upload
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
    }

    const { name, description, category, sizes, colors, price, totalQlty, brand } = req.body;

    // 1. Check if product already exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product with this name already exists");
    }

    // 2. Find Category
    const categoryFound = await Categories.findOne({
        name: category?.toLowerCase()
    });

    if (!categoryFound) {
        throw new Error(`Category "${category}" not found`);
    }

    // 3. Find Brand
    const brandFound = await Brands.findOne({
        name: brand?.toLowerCase()
    })

    if(!brandFound) {
        throw new Error(`Brand "${brand}" not found`)
    }

    // 4. Create Product
    const createProduct = await Product.create({
        name,
        description,
        category: categoryFound.name, // Use the name from the found category
        sizes,
        colors,
        user: req.userAuthId,
        price,
        brand: brandFound.name, // Use the name from the found brand
        totalQlty,
        // Add the image path/URL from the file upload
        images: [req.file.path] 
    });

    // 5. Push Product ID to Category and Brand
    categoryFound.products.push(createProduct._id);
    await categoryFound.save();

    brandFound.products.push(createProduct._id);
    await brandFound.save();

    res.status(201).json({
        status: "Success",
        msg: "Product Successfully Added",
        createProduct
    })
});

// @desc  add all products
// @route GET /api/v1/products
// @access public
export const getAllProductsCtrl = asyncHandler( async (req, res) => {

    let productQuery = Product.find()
    
    // --- Filtering Logic ---
    if (req.query.name) {
        productQuery = productQuery.find({ name: { $regex: req.query.name, $options: "i" } });
    }
    if (req.query.brand) {
        productQuery = productQuery.find({ brand: { $regex: req.query.brand, $options: "i" } });
    }
    if (req.query.category) {
        productQuery = productQuery.find({ category: { $regex: req.query.category, $options: "i" } });
    }
    if (req.query.color) {
        // Need to check if the product has the specific color in its 'colors' array
        productQuery = productQuery.find({ colors: { $in: [new RegExp(req.query.color, "i")] } });
    }
    if (req.query.sizes) {
        // Need to check if the product has the specific size in its 'sizes' array
        productQuery = productQuery.find({ sizes: { $in: [new RegExp(req.query.sizes, "i")] } });
    }

    // FIX: Price range filtering (Safe check implemented)
    if (req.query.price) {
        const priceQuery = req.query.price.split(" - ");
        
        if (priceQuery.length === 2) { 
            productQuery = productQuery.find({
                price: {$gte: Number(priceQuery[0]), $lte: Number(priceQuery[1])}
            });
            console.log('Price filter applied:', priceQuery);
        } else {
            console.warn('Malformed price query received, ignoring filter:', req.query.price);
        }
    }

    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments(); // Use the count before applying skip/limit

    const pagination = {}
    
    const endIndex = page * limit;

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

// @desc  get single product
// @route GET /api/v1/products/:id
// @access public
export const getSingleProductCtrl = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');
    
    if(!product) {
        throw new Error("No product found")
    }
    res.json({
        msg: "Product details fetched",
        product
    })
});

// @desc  update single product
// @route PUT /api/v1/products/update/:id
// @access private/admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
    const { name, description, category, sizes, colors, price, totalQlty, brand } = req.body;

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name, description, category, sizes, colors, price, totalQlty, brand 
        },
        { new: true, runValidators: true } // Add runValidators for schema validation
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

// @desc  delete single product
// @route DELETE /api/v1/products/delete/:id
// @access private/admin
export const deleteProductCtrl = asyncHandler( async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
        status: "success",
        msg: "Product deleted successfully",
    })
});
