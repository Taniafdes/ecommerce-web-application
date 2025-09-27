import { Router } from 'express'
import { deleteProductCtrl, getAllProductsCtrl, getSingleProductCtrl, newProductCtrl, updateProductCtrl } from '../controllers/ProductCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRoutes = Router();

// Create Product: Requires login, admin privileges, and file upload
productRoutes.post("/products", isLoggedIn, isAdmin, upload.single("file"), newProductCtrl);

// Get All Products (Public access)
productRoutes.get("/products", getAllProductsCtrl);

// Get Single Product (Public access)
productRoutes.get("/products/:id", getSingleProductCtrl);

// Update Product: Requires login and admin privileges
productRoutes.put("/products/update/:id", isLoggedIn, isAdmin, updateProductCtrl);

// Delete Product: Requires login and admin privileges
productRoutes.delete("/products/delete/:id", isLoggedIn, isAdmin, deleteProductCtrl);

export default productRoutes
