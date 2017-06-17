let express = require('express')
const router = express.Router()
const FFKEY = require('../config/food2forkAPI')
let f2fSearchResponse =
    {
        "count": 1,
        "recipes": [{
            "publisher": "Allrecipes.com",
            "social_rank": 99.81007979198002,
            "f2f_url": "http://food2fork.com/F2F/recipes/view/29159",
            "publisher_url": "http://allrecipes.com",
            "title": "Slow-Cooker Chicken Tortilla Soup",
            "source_url": "http://allrecipes.com/Recipe/Slow-Cooker-Chicken-Tortilla-Soup/Detail.aspx",
            "page": 1
        }]
    }

router.get('/getRecipes', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'POST',
        url: 'http://food2fork.com/api/search',
        form: {key: FFKEY.key}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        f2fSearchResponse=JSON.parse(body)
        //console.log(f2fSearchResponse.recipes)
        f2fSearchResponse.recipes.forEach( function (recipe) {
            console.log(recipe.title)
        })
        res.json(body)
    });
})

module.exports = router