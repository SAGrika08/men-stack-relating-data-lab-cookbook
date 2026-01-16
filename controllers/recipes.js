const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

    router.get ('/', async (req, res) => {
  try {
    const userRecipes = await Recipe.find({ owner: req.session.user._id });
    res.locals.recipes = userRecipes;
    res.render('recipes/index.ejs');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  const userIngredients = await Ingredient.find();  
  res.render('recipes/new.ejs', { ingredients: userIngredients });
});

router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipeToEdit = await Recipe.findById(req.params.recipeId).populate('ingredients');
        const userIngredients = await Ingredient.find();
        res.render('recipes/edit.ejs', { recipe: recipeToEdit, ingredients: userIngredients }); 
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});


router.post('/:recipeId', async (req, res) => {
    try {
        if (typeof req.body.ingredients === 'string') req.body.ingredients = [req.body.ingredients];
    if (!req.body.ingredients) req.body.ingredients = [];

        const updatedRecipe = await Recipe.findById(req.params.recipeId);
        await updatedRecipe.updateOne(req.body);
        return res.redirect('/recipes');
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

router.get ('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    res.locals.recipe = recipe;
    res.render('recipes/show.ejs'); 
  }
    catch (error) { 
    console.error(error);
    res.redirect('/recipes');   
}
});


router.post('/', async (req, res) => {
try {
    if (typeof req.body.ingredients === 'string') {
      req.body.ingredients = [req.body.ingredients];
    }

    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    await newRecipe.save();

    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.delete('/:recipeId', async (req, res) => {
    try {  
        const deletedRecipe = await Recipe.findById(req.params.recipeId);
        await deletedRecipe.deleteOne();
        res.redirect('/recipes');
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }             
});

router.post('/:recipeId/ingredients', async (req, res) => {
    try {
        const newIngredient = await Ingredient.create({ name: req.body.name });
        await Recipe.findByIdAndUpdate(
            req.params.recipeId,
            { $push: { ingredients: newIngredient._id } }
        );
        res.redirect(`/recipes/${req.params.recipeId}/edit`);
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

router.delete('/:recipeId/ingredients/:ingredientId', async (req, res) => {
    try{
        await Recipe.findByIdAndUpdate(
            req.params.recipeId,
            { $pull: { ingredients: req.params.ingredientId } }
        );
        res.redirect(`/recipes/${req.params.recipeId}/edit`);
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

module.exports = router;