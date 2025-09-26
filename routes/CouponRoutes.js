import express from "express";
import { createCoupon, getAllCouponCtrl, getDeleteCouponCtrl, getSingleCouponCtrl, getUpdateCouponCtrl } from "../controllers/CouponCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn, isAdmin, createCoupon)  
couponRoutes.get('/', getAllCouponCtrl)
couponRoutes.get('/:id', getSingleCouponCtrl)
couponRoutes.put('/update/:id', isAdmin, getUpdateCouponCtrl)
couponRoutes.delete('/delete/:id', isAdmin, getDeleteCouponCtrl)

export default couponRoutes