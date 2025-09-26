import express, { Router } from 'express';
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from '../controllers/BrandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const brandRoutes = Router();

brandRoutes.post('/', isLoggedIn, isAdmin, createBrandCtrl)
brandRoutes.get('/', getAllBrandCtrl)
brandRoutes.get('/:id', getSingleBrandCtrl)
brandRoutes.put('/:id', isAdmin, updateBrandCtrl)
brandRoutes.delete('/:id', isAdmin, deleteBrandCtrl)

export default brandRoutes