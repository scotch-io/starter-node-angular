//Get a router instance
const express = require('express')
const router = express.Router()

//Grab configs for Twitter
const twitterConfig = require('../config/twitter')

//Connect to user database
//No reason not to use the crypto version of the user model (because crypto)
const User = require('../models/UserWithCrypto')


const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

//Set up an options doc for the strategy.
//
const passportOptions = {
    consumerKey: twitterConfig.CONSUMER_KEY,
    consumerSecret: twitterConfig.CONSUMER_SECRET,
    callbackURL: twitterConfig.CALLBACK_URL
}

/*
 Once authenticated, Twitter will pass back oauth tokens and the user's Twitter profile,
 which we will use as a key in the database. Passport uses the Twitter IDfrom the
 profile in its serialize/deserialize methods
 */

passport.use(new TwitterStrategy(passportOptions,
    function (token, tokenSecret, profile, done) {
        User.findOneAndUpdate({twitterID: profile.id},
            {
                twitterID: profile.id,
                name: profile.displayName,
                username: profile.username
            },
            {'upsert': 'true'},
            function (err, result) {
                if (err) {
                    console.log(err)
                    return done(err, null)
                }
                else {
                    return done(null, profile)
                }
            })
    })
)

passport.serializeUser(function (user, done) {
    console.log('in serialize, setting id on session:', user.id)
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    console.log('in deserialize with id', id)
    User.findOne({twitterID: id}, function (err, user) {
        done(err, user)
    })
})


router.get('/success', function (req, res, next) {
    res.redirect('/')
})

router.get('/logout', function (req, res, next) {
    User.findOneAndRemove({twitterID: req.user.twitterID})
        .then(function (err, response) {
            req.logOut()
            res.clearCookie()
            res.status = 401
            res.redirect('/')
        })
})

//OAuth Step 1
router.get('/twitter',
    passport.authenticate('twitter'))

//OAuth Step 2
router.get('/callback',
    passport.authenticate('twitter',
        {failureRedirect: '/login',}),
    function (req, res) {
        res.cookie('authStatus', 'true')
        res.redirect('/')
    })

module.exports = router