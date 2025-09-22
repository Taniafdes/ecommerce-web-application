import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
   const { code, startDate, endDate, discount } = req.body;
   // console.log("👉 req.userAuthId from isLoggedIn:", req.userAuthId);
   // console.log("👉 Parsed values:", { code, startDate, endDate, discount }); // confirm destructuring

   console.log(req.query)
   const couponsExist = await Coupon.findOne({ code });
   if (couponsExist) {
      throw new Error('Coupon already exists');
   }

   if (isNaN(discount)) {
      throw new Error('Discount value must be a number');
   }

   const coupon = await Coupon.create({
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
      user: req.userAuthId,
   });


   res.json({
      status: "Success",
      message: "Coupon created successfully",
      coupon,
   });
});
 

export const getAllCouponCtrl = asyncHandler( async(req, res) => {
   const coupons = await Coupon.find();
   res.status(200).json({
      status: "success",
      message: "All coupons",
      coupons
   })
})


export const getSingleCouponCtrl = asyncHandler(async(req, res) => {
   const coupon = await Coupon.findById(req.params.id)
   res.json({
      status: "success",
      message: "Single Coupon fetched",
      coupon
   })
})


export const getUpdateCouponCtrl = asyncHandler(async(req, res) => {
   const { code, startDate, endDate, discount } = req.body;
   const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
   }, {
      new: true,
   })
   res.json({
      status: "success",
      message: "Coupon Updated",
      code,
   })
})

export const getDeleteCouponCtrl = asyncHandler(async(req, res) => {
   const coupon = await Coupon.findByIdAndDelete(req.params.id)
   res.json({
      status: "success",
      message: "Coupon Deleted",
      coupon,
   })
})