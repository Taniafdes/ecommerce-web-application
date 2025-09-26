import express, { Router } from 'express';
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from '../controllers/BrandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const brandRoutes = Router();

brandRoutes.post('/brands', isLoggedIn, isAdmin, createBrandCtrl)
brandRoutes.get('/brands', getAllBrandCtrl)
brandRoutes.get('/brands/:id', getSingleBrandCtrl)
brandRoutes.put('/brands/update/:id', isAdmin, updateBrandCtrl)
brandRoutes.delete('/brands/:id', isAdmin, deleteBrandCtrl)

export default brandRoutes