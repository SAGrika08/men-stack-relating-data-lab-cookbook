const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// router logic will go here - will be built later on in the lab
//get all ingredients for a user
router.get ('/', async (req, res) => {
    try {
        const userIngredients = await Ingredient.find();
        res.locals.ingredients = userIngredients;
        res.render('ingredients/index.ejs');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    try {
        const newIngredient = new Ingredient(req.body);
        await newIngredient.save();
        return res.redirect('/ingredients');
    } catch (error) {
        console.error(error);
        res.redirect('/ingredients');
    }
});


router.delete('/:ingredientId', async (req, res) => {
    const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.ingredientId);
    res.redirect('/ingredients');
});

module.exports = router;