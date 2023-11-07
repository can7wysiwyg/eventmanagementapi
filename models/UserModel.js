const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    userImage: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: Number,
        default: 0
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('User', UserSchema)