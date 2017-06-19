let express = require('express')
const router = express.Router()
const FFKEY = require('../config/food2forkAPI')
const SUPERMARKETKEY = require('../config/supermarketAPI')
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
router.get('/ingredients/:itemName', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'GET',
        url: 'http://www.supermarketapi.com/api.asmx/SearchByProductName',
        qs: {APIKEY: SUPERMARKETKEY.key, ItemName: req.params.itemName},
        form: {APIKEY: SUPERMARKETKEY.key, ItemName: req.params.itemName}
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });

})
router.get('/stores/:state/:city', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'GET',
        url: 'http://www.supermarketapi.com/api.asmx/StoresByCityState',
        qs: {
            APIKEY: SUPERMARKETKEY.key,
            SelectedCity: req.params.city,
            SelectedState: req.params.state
        },
        form: {APIKEY: SUPERMARKETKEY.key}
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });

})

module.exports = router