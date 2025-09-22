import express from "express";
import { createCoupon, getAllCouponCtrl, getDeleteCouponCtrl, getSingleCouponCtrl, getUpdateCouponCtrl } from "../controllers/CouponCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn, createCoupon)  
couponRoutes.get('/', getAllCouponCtrl)
couponRoutes.get('/:id', getSingleCouponCtrl)
couponRoutes.put('/update/:id', getUpdateCouponCtrl)
couponRoutes.delete('/delete/:id', getDeleteCouponCtrl)

export default couponRoutes