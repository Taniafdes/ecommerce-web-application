import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorsCtrl, deleteColorsCtrl, getAllColorsCtrl, getSingleColorsCtrl, updateColorsCtrl } from "../controllers/ColorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";


const colorRoutes = Router();

colorRoutes.post('/colors', isLoggedIn, isAdmin, createColorsCtrl)
colorRoutes.get('/colors', getAllColorsCtrl)
colorRoutes.get('/colors/:id', getSingleColorsCtrl)
colorRoutes.put('/colors/update/:id', isAdmin, updateColorsCtrl)
colorRoutes.delete('/colors/:id', isAdmin, deleteColorsCtrl)

export default colorRoutes