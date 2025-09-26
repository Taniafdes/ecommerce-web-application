import express, { Router } from 'express'
import { deleteProductCtrl, getAllProductsCtrl, getSingleProductCtrl, newProductCtrl, updateProductCtrl } from '../controllers/ProductCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRoutes = Router();
productRoutes.post("/products", isLoggedIn, isAdmin, upload.single("file"), newProductCtrl)

productRoutes.get("/products", getAllProductsCtrl)
productRoutes.get("/products/:id", getSingleProductCtrl) // Use /products/:id
productRoutes.put("/products/update/:id", isLoggedIn, isAdmin, updateProductCtrl)
productRoutes.delete("/products/delete/:id", isLoggedIn, isAdmin, deleteProductCtrl)
// productRoutes.delete("/products/:id", isLoggedIn, isAdmin, deleteProductCtrl) // Cleaner delete URL
export default productRoutes