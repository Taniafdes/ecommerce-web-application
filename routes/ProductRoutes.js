import express, { Router } from 'express'
import { deleteProductCtrl, getAllProductsCtrl, getSingleProductCtrl, newProductCtrl, updateProductCtrl } from '../controllers/ProductCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';

const productRoutes = Router();
productRoutes.post("/", isLoggedIn, upload.single("file"), newProductCtrl)


productRoutes.get("/", getAllProductsCtrl)
productRoutes.get("/:id", getSingleProductCtrl)
productRoutes.put("/:id", isLoggedIn, updateProductCtrl)
productRoutes.delete("/:id/delete", isLoggedIn, deleteProductCtrl)
export default productRoutes