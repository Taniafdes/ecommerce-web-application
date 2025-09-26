import express, { Router } from 'express'
import { deleteProductCtrl, getAllProductsCtrl, getSingleProductCtrl, newProductCtrl, updateProductCtrl } from '../controllers/ProductCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRoutes = Router();
productRoutes.post("/", isLoggedIn, isAdmin, upload.single("file"), newProductCtrl)


productRoutes.get("/", getAllProductsCtrl)
productRoutes.get("/:id", getSingleProductCtrl)
productRoutes.put("/:id", isLoggedIn, isAdmin, updateProductCtrl)
productRoutes.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductCtrl)
export default productRoutes