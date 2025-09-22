import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { CreateReviewCtrl } from "../controllers/reviewCtrl.js";

const reviewRoutes = Router();

reviewRoutes.post("/:productID", isLoggedIn, CreateReviewCtrl)

export default reviewRoutes