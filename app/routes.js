const parseString = require('xml2js').parseString;
const express = require('express')
const request = require("request");
const router = express.Router()
const FFKEY = require('../config/food2forkAPI')
const SUPERMARKETKEY = require('../config/supermarketAPI')

let stores = []

router.get('/getRecipes', function (req, res, next) {
    /*example return
     "count":30,
     "recipes":[{
     "publisher":"The Pioneer Woman",
     "f2f_url":"http://food2fork.com/view/47024",
     "title":"Perfect Iced Coffee",
     "source_url":"http://thepioneerwoman.com/cooking/2011/06/perfect-iced-coffee/",
     "recipe_id":"47024",
     "image_url":"http://static.food2fork.com/icedcoffee5766.jpg",
     "social_rank":100,
     "publisher_url":"http://thepioneerwoman.com"}, ...]*/
    let options = {
        method: 'POST',
        url: 'http://food2fork.com/api/search',
        form: {key: FFKEY.key}
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let recipeList = JSON.parse(body)
        let recipeLinks = []
        recipeList.recipes.forEach(function (recipe) {
            recipeLinks.push(recipe.source_url)
        })
        res.json({Recipes: recipeLinks})
    });
})
// router.get('/:recipeId', function (req, res, next) {
//     /*example return
//      "recipe":{
//      "publisher":"The Pioneer Woman",
//      "f2f_url":"http://food2fork.com/view/47024",
//      "ingredients":[
//      "1 pound Ground Coffee (good, Rich Roast)",
//      "8 quarts Cold Water","Half-and-half (healthy Splash Per Serving)",
//      "Sweetened Condensed Milk (2-3 Tablespoons Per Serving)",
//      "Note: Can Use Skim Milk, 2% Milk, Whole Milk, Sugar, Artificial Sweeteners, Syrups...adapt To Your Liking!"],
//      "source_url":"http://thepioneerwoman.com/cooking/2011/06/perfect-iced-coffee/",
//      "recipe_id":"47024",
//      "image_url":"http://static.food2fork.com/icedcoffee5766.jpg",
//      "social_rank":100,"publisher_url":"http://thepioneerwoman.com",
//      "title":"Perfect Iced Coffee"}*/
//     let options = {
//         method: 'POST',
//         url: 'http://food2fork.com/api/get',
//         form: {key: FFKEY.key, rId: req.params.recipeId}
//     };
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//         let selectedRecipe = JSON.parse(body)
//         res.json(selectedRecipe)
//     });
// })

router.post('/searchForIngredient', function (req, res, next) {
    /*example result
     "ArrayOfStore":{
     "$":{
     "xmlns:xsd":"http://www.w3.org/2001/XMLSchema",
     "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
     "xmlns":"http://www.SupermarketAPI.com"},
     "Store":[{
     "Storename":["Shaw's  "],
     "Address":["33 Kilarnock Street"],
     "City":["Boston"],
     "State":["MA"],
     "Zip":["2215"],
     "Phone":[" "],
     "StoreId":["2341ab1afa"]}, ...}*/
    let options = {
        method: 'POST',
        url: 'http://www.supermarketapi.com/api.asmx/StoresByCityState',
        form: {
            APIKEY: SUPERMARKETKEY.key,
            SelectedCity: req.body.city,
            SelectedState: req.body.state
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        parseString(body, function (err, result) {
            result.ArrayOfStore.Store.forEach(function (store) {
                stores.push(store)
            })
            /* example result
             "ArrayOfProduct":{
             "$":{
             "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
             "xmlns:xsd":"http://www.w3.org/2001/XMLSchema",
             "xmlns":"http://www.SupermarketAPI.com"},
             "Product":[{
             "Itemname":["Bustello Cafe Coffee Regular - 10 Oz"],
             "ItemDescription":["Dark roast, special for espresso coffee..."],
             "ItemCategory":["Beverages"],
             "ItemID":["27278"],
             "ItemImage":["http://smapistorage.blob.core.windows.net/thumbimages/119010996_100x100.jpg"],
             "AisleNumber":["Aisle:8"]}, ...}
             */
            let results = []
            stores.forEach(function (store) {
                let options = {
                    method: 'POST',
                    url: 'http://www.supermarketapi.com/api.asmx/SearchForItem',
                    form: {
                        APIKEY: SUPERMARKETKEY.key,
                        StoreId: store.StoreId[0],
                        ItemName: req.body.item
                    }
                };
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    parseString(body, function (err, result) {
                        results.push(result)
                    });
                });
            })
            res.json({message: "hmm"})
        });
    });
})
router.get('/:storeId/:item', function (req, res, next) {

})

module.exports = router