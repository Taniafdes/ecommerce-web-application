import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv  from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config();

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY)

export const createOrderCtrl = asyncHandler(async (req, res) => {

  const { coupons } = req?.query;

      const couponFound = await Coupon.findOne({
        code: coupons?.toUpperCase(),
      })

      if(couponFound?.isExpired) {
          throw new Error('Coupon has Expired')
      }
      if(!couponFound) {
        throw new Error('Coupon does not exist')
      }

      const discount = couponFound?.discount / 100;

    const { orderItems, shippingAddress, totalPrice } = req.body;
    console.log(req.query)

    if (  orderItems.length <= 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const user = await User.findById(req.userAuthId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

     if (!user?.hasShippingAddress) {
        // Assuming shippingAddress is correctly present in req.body
        user.shippingAddress = shippingAddress; 
        user.hasShippingAddress = true; 
        await user.save();
        // The Mongoose validation error should now be resolved because 
        // the user's profile is updated, and the flow is not interrupted.
    }

    const order = await Order.create({
        user: user._id,
        orderItems,
        shippingAddress,
        totalPrice : couponFound ? totalPrice - totalPrice * discount : totalPrice,
        status: "pending"
    });
    console.log(order)
    user.orders.push(order?._id)
    await user.save();

   const convertedOrders = orderItems.map((item) => ({
  price_data: {
    currency: "usd",
    product_data: {
      name: item?.name,
      description: item?.description,
    },
    unit_amount: item?.price * 100, // Stripe expects cents
  },
  quantity: item?.qty,
}));

   const products = await Product.find({
  _id: { $in: orderItems.map((item) => item._id) }
});

orderItems.map(async (item) => {
  const product = products.find(
    (p) => p._id.toString() === item._id.toString()
  );
  if (product) {
    product.totalSold += item.qty;
    await product.save();
  }
});
    user.orders.push(order?._id)
    await user.save();

    //make payment (stripe)
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId : JSON.stringify(order?._id),
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
    })

    res.send({url: session.url})

});


export const getAllOrdersCtrl = asyncHandler(async(req, res) => {
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  })
})


export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    success: true,
    message: "All orders",
    order,
  })
})

export const updateOrderCtrl = asyncHandler(async(req, res) => {
  const id = req.params.id;
  const updatedOrder = await Order.findByIdAndUpdate(id, {
    status: req.body.status,
  }, {
    new: true,
  });
  res.json({
    success: true,
    message: "Order updated",
    updatedOrder
  })
})

// get sum of all total orders
export const getOrderStatsCtrl = asyncHandler(async(req, res) => {

  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: '$totalPrice',
        },
         totalSales: {
          $sum: "$totalPrice",
        },
        maxSales: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        }
      }
    }
  ])

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDay());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        }
      }
    }, {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice"
        }
      }
    }
  ])
   res.json({
      success: true,
      message: "Sum of orders",
      orders,
      saleToday
    })
})