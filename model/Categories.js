import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
            type: String,
            default: "https://via.placeholder.com/150",
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


const Categories = mongoose.model('Categories', categoriesSchema)

export default Categories