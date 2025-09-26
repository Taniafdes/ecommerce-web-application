import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorsCtrl, deleteColorsCtrl, getAllColorsCtrl, getSingleColorsCtrl, updateColorsCtrl } from "../controllers/ColorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";


const colorRoutes = Router();

colorRoutes.post('/', isLoggedIn, isAdmin, createColorsCtrl)
colorRoutes.get('/', getAllColorsCtrl)
colorRoutes.get('/:id', getSingleColorsCtrl)
colorRoutes.put('/:id', isAdmin, updateColorsCtrl)
colorRoutes.delete('/:id', isAdmin, deleteColorsCtrl)

export default colorRoutes