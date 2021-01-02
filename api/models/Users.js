const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    email: String,
    password: String,
    address: String,
    phone: Number,
    salt: String,
    role: {type: String, default: 'user'}
})

const Users = mongoose.model('User', User)

module.exports = Users