let express = require('express')
const router = express.Router()
const FFKEY = require('../config/food2forkAPI')
let f2fSearchResponse =
    {
        "count": undefined,
        "recipes": []
    }
let f2fGetRecipeResponse = []

router.get('/getRecipes', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'POST',
        url: 'http://food2fork.com/api/search',
        form: {key: FFKEY.key}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        f2fSearchResponse = JSON.parse(body)
        f2fSearchResponse.recipes.forEach(function (recipe) {
            console.log(recipe.recipe_id)
        })
        res.json(f2fSearchResponse)
    });
})
router.get('/:recipeId', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'POST',
        url: 'http://food2fork.com/api/get',
        form: {key: FFKEY.key, rId: req.params.recipeId}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        f2fGetRecipeResponse = JSON.parse(body)
        res.json(f2fGetRecipeResponse)
    });
})

module.exports = router