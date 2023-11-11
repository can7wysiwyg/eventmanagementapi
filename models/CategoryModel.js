const mongoose = require('mongoose')

const CatSchema = mongoose.Schema({

    catName: {
        type: String,
        required: true,
        unique: true
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Category', CatSchema)