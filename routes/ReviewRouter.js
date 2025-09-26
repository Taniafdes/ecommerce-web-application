import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/ReviewCtrl.js";

const reviewRoutes = Router();

reviewRoutes.post("/:productID", isLoggedIn, createReviewCtrl)

export default reviewRoutes
