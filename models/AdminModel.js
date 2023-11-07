const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

    adminName: {
        type: String,
        required: true,
        unique: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
    },
    adminPassword: {
        type: String,
        required: true,
        unique: true,
    },

    adminImage: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        default: 0
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('Admin', AdminSchema)