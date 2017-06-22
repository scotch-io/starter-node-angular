const express = require('express')
const router = express.Router()
const parseString = require('xml2js').parseString;
const request = require("request");
const rp = require('request-promise')
const FFKEY = require('../config/food2forkAPI')
const SUPERMARKETKEY = require('../config/supermarketAPI')

//Helper for authorization
const authorized = require('./authCheck')

const mongoose = require('mongoose')
if (!mongoose.connection.db) {
    mongoose.connect('mongodb://localhost/cs591')
}
const db = mongoose.connection
const Schema = mongoose.Schema
const personSchema = new Schema({
    name: String,
    UID: String,
    department: String
})
const people = mongoose.model('people', personSchema)


// POST Create a new user (only available to logged-in users)
router.post('/db', authorized, function (req, res, next) {
    aPerson = new people(
        req.body
    )
    aPerson.save(function (err) {
        if (err) {
            res.send(err)
        }
        //send back the new person
        else {
            res.send(aPerson)
        }
    })
})

//GET Fetch all users
router.get('/db', function (req, res, next) {
    people.find({}, function (err, results) {
        res.json(results)
    })

})

/*
 //GET Fetch single user, match /users/db/Frank
 router.get('/db/:_id', function (req, res, next) {
 people.find({_id: req.param('_id')}, function (err, results) {
 res.json(results);
 });
 });
 */

router.get('/db/:name', function (req, res, next) {
    findByName(req.params.name)
        .then(function (status) {
            res.json(status)
        })
        .catch(function (status) {
            res.json(status)

        })
})

//PUT Update the specified user's name
router.put('/db/:_id', function (req, res, next) {
    people.findByIdAndUpdate(req.params._id, req.body, {'upsert': 'true'}, function (err, result) {
        if (err) {
            res.json({message: 'Error updating'})
        }
        else {
            console.log('updated')
            res.json({message: 'success'})
        }

    })

})

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
    const options = {
        method: 'POST',
        url: 'http://food2fork.com/api/search',
        form: {key: FFKEY.key}
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const recipeList = JSON.parse(body)
        const recipeLinks = [{}]
        recipeList.recipes.forEach(function (recipe) {
            recipeLinks.push({title: recipe.title, url: recipe.source_url})
        })
        res.json(recipeLinks)
    });
})

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
    const resultPromises1 = []
    const options = {
        method: 'POST',
        url: 'http://www.supermarketapi.com/api.asmx/StoresByCityState',
        form: {
            APIKEY: SUPERMARKETKEY.key,
            SelectedCity: req.body.SelectedCity,
            SelectedState: req.body.SelectedState
        }
    };
    const p1 = rp(options)
        .catch(function (err) {
            res.send(err)
        })
    resultPromises1.push(p1)
    Promise.all(resultPromises1)
        .then(function (resp) {
            parseString(resp, function (err, result) {
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
                const resultPromises = [];
                stores.forEach(function (store) {
                    const options = {
                        method: 'POST',
                        url: 'http://www.supermarketapi.com/api.asmx/SearchForItem',
                        form: {
                            APIKEY: SUPERMARKETKEY.key,
                            StoreId: store.StoreId[0],
                            ItemName: req.body.ItemName
                        }
                    };
                    const p = rp(options)
                        .catch(function (err) {
                            res.send(err)
                        });

                    resultPromises.push(p);
                });

                Promise.all(resultPromises)
                    .then(function (resp) {
                        parseString(resp, function (err, result) {
                            const results = result.ArrayOfProduct.Product
                            res.json({stores: results})
                        })
                    });
            })
        })
})


//DELETE Delete the specified user
router.delete('/db/:_id', function (req, res, next) {
    people.findByIdAndRemove(req.params._id, function (err, result) {
        if (err) {
            res.json({message: 'Error deleting'})
        }
        else {
            res.json({message: 'success'})
        }
    })
})


let findByName = function (checkName) {
    return new Promise(function (resolve, reject) {
        people.find({name: checkName}, function (err, results) {
            console.log(results, results.length)
            if (results.length > 0) {
                resolve({found: results})
            }
            else {
                reject({found: false})
            }
//    return ( (results.length  > 0) ? results : false)
        })
    })
}

module.exports = router

//TODO Route to log out (req.logout())