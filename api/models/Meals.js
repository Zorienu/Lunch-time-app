const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Meal = new Schema({
    name: String,
    desc: String,
    price: Number,
    img_link: String
})

const Meals = mongoose.model('Meal', Meal)

module.exports = Meals