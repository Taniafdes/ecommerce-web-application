import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorsCtrl, deleteColorsCtrl, getAllColorsCtrl, getSingleColorsCtrl, updateColorsCtrl } from "../controllers/ColorsCtrl.js";


const colorRoutes = Router();

colorRoutes.post('/', isLoggedIn, createColorsCtrl)
colorRoutes.get('/', getAllColorsCtrl)
colorRoutes.get('/:id', getSingleColorsCtrl)
colorRoutes.put('/:id', updateColorsCtrl)
colorRoutes.delete('/:id', deleteColorsCtrl)

export default colorRoutes