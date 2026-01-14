const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

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

router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipeToEdit = await Recipe.findById(req.params.recipeId);
        res.render('recipes/edit.ejs', { recipe: recipeToEdit });
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});


router.put('/:recipeId', async (req, res) => {
    try {
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
    const recipe = await Recipe.findById(req.params.recipeId);
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


module.exports = router;