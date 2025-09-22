import express, { Router } from 'express';
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from '../controllers/BrandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
const brandRoutes = Router();

brandRoutes.post('/', isLoggedIn, createBrandCtrl)
brandRoutes.get('/', getAllBrandCtrl)
brandRoutes.get('/:id', getSingleBrandCtrl)
brandRoutes.put('/:id', updateBrandCtrl)
brandRoutes.delete('/:id', deleteBrandCtrl)

export default brandRoutes