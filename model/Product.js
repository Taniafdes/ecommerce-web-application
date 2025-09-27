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

productSchema.virtual("qtyLeft").get(function() {
    const product = this;
    return product.totalQlty - product.totalSold;
});

productSchema.virtual('getReviews').get(function(){
    const product = this;
    return product?.reviews?.length;
})

productSchema.virtual('averageRating').get(function() {
    let totalRating = 0;
    const product = this;
    product?.reviews?.forEach((review)=> {
        totalRating += review?.rating
    })
    const averageRating = Number(totalRating/product?.reviews?.length).toFixed(1);

    return averageRating;
})

const Product = mongoose.model('Product', productSchema)

export default Product