import express, { Router } from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createOrderCtrl, getAllOrdersCtrl,getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from '../controllers/OrderCtrl.js';

const OrderRouter = Router();

//  create an order
OrderRouter.post('/orders', isLoggedIn ,createOrderCtrl)
OrderRouter.get('/orders', isLoggedIn ,getAllOrdersCtrl)
OrderRouter.get('/orders/sales/stats', isLoggedIn ,getOrderStatsCtrl)
OrderRouter.get('/orders/:id', isLoggedIn ,getSingleOrderCtrl)
OrderRouter.put('/orders/update/:id', isLoggedIn ,updateOrderCtrl)

export default OrderRouter;