import express from "express";
import { createCoupon, getAllCouponCtrl, getDeleteCouponCtrl, getSingleCouponCtrl, getUpdateCouponCtrl } from "../controllers/CouponCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const couponRoutes = express.Router();

couponRoutes.post('/coupons', isLoggedIn, isAdmin, createCoupon)  
couponRoutes.get('/coupons', getAllCouponCtrl)
couponRoutes.get('/coupons/:id', getSingleCouponCtrl)
couponRoutes.put('/coupons/update/:id', isAdmin, getUpdateCouponCtrl)
couponRoutes.delete('/coupons/delete/:id', isAdmin, getDeleteCouponCtrl)

export default couponRoutes