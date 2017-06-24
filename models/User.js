const mongoose = require('mongoose')

//Set up ES6 Promises
mongoose.Promise = global.Promise;

//If there's already a connection, we'll just use that, otherwise connect here.
//
if (!mongoose.connection.db) {
    mongoose.connect('mongodb://localhost/cs591')
}
const db = mongoose.connection

const Schema = mongoose.Schema
const user = new Schema({
    username:   String,
    password:   String,
    firstName:  String
})

//The mongo collection will be users in the cs591 database...Mongoose adds an 's'
//to the end of the model name automatically
//
const User = mongoose.model('user', user)

module.exports = User