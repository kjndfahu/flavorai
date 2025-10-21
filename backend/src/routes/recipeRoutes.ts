import {addRecipe, getAllRecipes, getRecipeById, rateRecipe} from './../controllers/recipeController';
import { authMiddleware } from '../middleware/authMiddleware';
import express from "express";

const router = express.Router();

router.post("/", authMiddleware, addRecipe);
router.get("/", getAllRecipes);
router.post("/rate", authMiddleware, rateRecipe);
router.get("/:id", getRecipeById);

export default router;

