const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    user_email: String,
    user_address: String,
    user_phone: String,
    order: [{
        meal_id: {type: Schema.Types.ObjectId, ref: 'Meal'},
        quantity: Number
    }]
})

const Orders = mongoose.model('Order', Order)

module.exports = Orders