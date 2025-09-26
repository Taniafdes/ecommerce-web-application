import express, { Router } from 'express'
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoriesCtrl, updateCategoryCtrl } from '../controllers/CategoriesCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';

const categoriesRoutes= Router();

categoriesRoutes.post("/",isLoggedIn, categoryFileUpload.single("file"), createCategoryCtrl)
categoriesRoutes.get("/", getAllCategoriesCtrl)
categoriesRoutes.get("/:id", getSingleCategoriesCtrl)
categoriesRoutes.put("/:id", updateCategoryCtrl)
categoriesRoutes.delete("/:id", deleteCategoryCtrl)

export default categoriesRoutes;