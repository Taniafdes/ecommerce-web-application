import express, { Router } from 'express'
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoriesCtrl, updateCategoryCtrl } from '../controllers/CategoriesCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';

const categoriesRoutes= Router();

categoriesRoutes.post("/categories",isLoggedIn, categoryFileUpload.single("file"), createCategoryCtrl)
categoriesRoutes.get("/categories", getAllCategoriesCtrl)
categoriesRoutes.get("/categories/:id", getSingleCategoriesCtrl)
categoriesRoutes.put("/categories/update/:id", updateCategoryCtrl)
categoriesRoutes.delete("/categories/:id", deleteCategoryCtrl)

export default categoriesRoutes;