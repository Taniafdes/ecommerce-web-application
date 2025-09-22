import mongoose from "mongoose";
const Schema = mongoose.Schema;

const colorsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, {
    timestamps: true,
}
);


const Colors = mongoose.model('Colors', colorsSchema)

export default Colors