import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
],

}, {
    timestamps: true,
}
);


const Brands = mongoose.model('Brands', brandsSchema)

export default Brands