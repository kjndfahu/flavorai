import { Request, Response } from "express"
import { prisma } from "../config/prisma";

interface AuthRequest extends Request {
    user?: { id: number };
}

export const addRecipe = async (req: AuthRequest, res: Response) => {
    try{
        const {title, ingredients, instruction} = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

    const recipe = await prisma.recipe.create({
        data: {
            title,
            ingredients,
            instruction,
            userId: req.user.id
        }
    })

    res.json(recipe)
    } catch(err: any){
        res.status(400).json({error: err.message})
    }
}

export const getAllRecipes = async (req: Request, res: Response) => {
    try{
        const recipes = await prisma.recipe.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })

        res.status(201).json(recipes);
        
    } catch(err: any){
        res.status(400).json({error: err.message})
    }
}

export const rateRecipe = async (req: Request, res: Response) => {
    try {
        const { recipeId, rating } = req.body;

        const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const newRating = rating;

        const updated = await prisma.recipe.update({
            where: { id: recipeId },
            data: { rating: newRating },
        });

        res.json(updated);
    } catch (err: unknown) {
        if (err instanceof Error) res.status(400).json({ error: err.message });
    }
};

export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const recipeId = Number(id);
        if (isNaN(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                user: {
                    select: { username: true }
                }
            }
        });

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(200).json(recipe);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};