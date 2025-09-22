import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Reviews from "../model/Reviews.js";

export const CreateReviewCtrl = asyncHandler(async (req, res) => {
    const { message, rating } = req.body;
    const { productID } = req.params;

    // console.log('req', req)

    // Find the product
    const findProduct = await Product.findById(productID).populate('reviews');

    if (!findProduct) {
        res.status(404);
        throw new Error("Product ID not found");
    }

    const hasReviewed = findProduct?.reviews?.find((review)=> {
        return review?.user.toString() === req?.userAuthId.toString();
    })

    if(hasReviewed) {
        throw new Error("You have already reviewed this product")
    }

    // Create review
    const review = await Reviews.create({
        message,
        rating,
        product: findProduct._id,
        user: req.userAuthId,
    });

    // Push review to product
    findProduct.reviews.push(review._id);
    await findProduct.save();

    res.status(201).json({
        success: true,
        msg: "Review has been created successfully",
        review
    });
});
