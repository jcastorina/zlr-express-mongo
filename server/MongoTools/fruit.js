const mongoose = require('mongoose')
const { Schema } = mongoose

const FruitSchema = new Schema({
    
    name: String,
    colors: [ String ],
    inSeason: Boolean,

})

module.exports = mongoose.model('Fruit', FruitSchema)