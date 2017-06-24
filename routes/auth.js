const express = require('express')
const router = express.Router()

//Connect to user database
//const User = require('../models/User')
const User = require('../models/UserWithCrypto')

//Use Passport for authentication - this version uses a local mongo collection
//via passport-local

//For this simple strategy, we just check the username and (plain text) password.
//If they match, passport calls req.login() and the user ID is placed on the session
//in passport.serializeUser()
//
//Set up an options doc for the strategy. Note: Passing req to passport is NOT well documented; it is briefly mentioned
//in the description of the Twitter strategy

const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy

const passportOptions = {
    passReqToCallback: true,
    failureFlash     : true
}

passport.use(new LocalStrategy(passportOptions,
    function (req, username, password, done) {
        //nb Need to use findOne, since find returns an array. Also, simpler exanple uses password,
        //not passwordhash, so adjust test accordingly
        User.findOne({username: username}).exec()
            .then(function (user) {
                if (!user || (!user.checkPassword(password))) {
                    return done(null, false, req.flash('message', 'Incorrect user or pass!'))
                }
                else {
                    return done(null, user, req.flash('message', 'Welcome!'))
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }
))

passport.serializeUser(function (user, done) {
    console.log('in serialize, setting id on session:', user.id)
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    console.log('in deserialize with id', id)
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/login',
    })
)

router.get('/login', function (req, res, next) {
    console.log(req.flash('error'))
    res.render('login', {message: req.flash('message')})
})
router.get('/success', function (req, res, next) {
    res.redirect('/')
})

router.get('/logout', function (req, res, next) {
    req.logOut()
    res.status = 401
    res.redirect('/')
})

router.post('/register', function (req, res, next) {
    let user = new User({
        'username': req.body.username,
        'name'    : req.body.name
    })
    user.setPassword(req.body.password)
    user.save()
        .then(function (err, result) {
            res.redirect('/')
        })
        .catch(function (err, result) {
            res.send({message: 'Error in save', error: err})
        })
})
router.get('/register', function (req, res, next) {
    res.render('register')
})

module.exports = router