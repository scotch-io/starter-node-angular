let express = require('express')
const router = express.Router()
const FFKEY = require('../config/food2forkAPI')

router.get('/getRecipes', function (req, res, next) {
    let request = require("request");
    let options = {
        method: 'POST',
        url: 'http://food2fork.com/api/search',
        form: {key: FFKEY.key}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body)
    });
})

module.exports = router