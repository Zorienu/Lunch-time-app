const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    user_name: String,
    user_email: String,
    user_address: String,
    user_phone: String,
    price: Number,
    order: [{
        meal: String,
        quantity: Number
    }]
})

const Orders = mongoose.model('Order', Order)

module.exports = Orders