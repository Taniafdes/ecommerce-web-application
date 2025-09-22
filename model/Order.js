import mongoose, { Schema } from "mongoose";
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNo = Math.floor(1000 + Math.random() * 90000)
const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            type: Object,
            required: true
        }
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber: {
        type: String,
        default: randomText + randomNo
    },
    paymentStatus: {
        type: String,
        default: 'Not Paid'
    },
    paymentMethod: {
        type: String,
        default: "Not Specified"
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    currency: {
        type: String,
        default: 'Not Specified'
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['pending', 'processing', 'shipped', 'delivered'],
    },
    deliveredType: {
        type: Date,
    },
},
{
    Timestamps: true
}
)

const Order = mongoose.model('Order', OrderSchema)
export default Order