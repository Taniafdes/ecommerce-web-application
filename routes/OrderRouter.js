import express, { Router } from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createOrderCtrl, getAllOrdersCtrl,getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from '../controllers/OrderCtrl.js';

const OrderRouter = Router();

//  create an order
OrderRouter.post('/', isLoggedIn ,createOrderCtrl)
OrderRouter.get('/', isLoggedIn ,getAllOrdersCtrl)
OrderRouter.get('/sales/stats', isLoggedIn ,getOrderStatsCtrl)
OrderRouter.get('/:id', isLoggedIn ,getSingleOrderCtrl)
OrderRouter.put('/update/:id', isLoggedIn ,updateOrderCtrl)

export default OrderRouter;