/*
 For this version we'll add a register method to add a user to the database using proper
 password encryption. It also demonstrates how to add and use a method on a schema.
 Reference: https://www.sitepoint.com/user-authentication-mean-stack
 */
const mongoose = require('mongoose')
const crypto = require('crypto')
//const findOrCreate = require('mongoose-findorcreate')

//Set up ES6 Promises
mongoose.Promise = global.Promise

//If there's already a connection, we'll just use that, otherwise connect here.
//
if (!mongoose.connection.db) {
    mongoose.connect('mongodb://localhost/cs591')
}
const db = mongoose.connection

const Schema = mongoose.Schema

const user = new Schema({
    username    : {
        type    : String,
        required: true,
        unique  : true
    },
    passwordHash: String,
    passwordSalt: String,

    name: {
        type    : String,
        required: true
    },
    twitterID: String
})

//Set up the findOrCreate plugin
//user.plugin(findOrCreate)

/*
 Add a method to the schema that takes a plaintext password and stores the hashed
 value, along with the salt, in the database
 */

user.methods.setPassword = function (password) {
    this.passwordSalt = crypto.randomBytes(16).toString('hex')
    this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64).toString('hex')
}

user.methods.checkPassword = function (password) {
    let testHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64).toString('hex')
    return testHash === this.passwordHash
}
//The mongo collection will be users in the cs591 database...Mongoose adds an 's'
//to the end of the model name automatically unless the collection ends in a digit
//
const User = mongoose.model('tweets', user)

module.exports = User