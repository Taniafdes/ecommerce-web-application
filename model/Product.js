import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        ref: "Categories",
        required: true
    },
    sizes:
    {
        type: [String],
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
    },
    colors: {
        type: [String],
        required: true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    images: [
        {
            type: String,
            default: "https://via.placeholder.com/150"
        },
    ],
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
    }
],
    price: {
        type: Number,
        required: true,
    },
    totalQlty: {
        type: Number,
        required: true
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0,
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
}
);

// Virtual field for quantity left
productSchema.virtual("qtyLeft").get(function() {
    return this.totalQlty - this.totalSold;
});

// Virtual field for number of reviews
productSchema.virtual('getReviews').get(function(){
    return this?.reviews?.length;
})

// Virtual field for average rating
productSchema.virtual('averageRating').get(function() {
    let totalRating = 0;
    this?.reviews?.forEach((review)=> {
        totalRating += review?.rating
    })
    // Calculate and format the average rating
    const averageRating = this?.reviews?.length > 0 ? 
        Number(totalRating / this.reviews.length).toFixed(1) : 
        0;

    return averageRating;
})

const Product = mongoose.model('Product', productSchema)

export default Product
