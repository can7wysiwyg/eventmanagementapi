const mongoose = require('mongoose')


const EventSchema = mongoose.Schema({

    eventName: {
        type: String,
        required: true
    },
    eventOwner: {
        type: String,
        required: true

    },
    eventDate: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventPrice: {
        type: String,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    },
    eventPoster: {
    type: String,
    required: true

    }


}, {
    timestamps: true
})

module.exports = mongoose.model('Event', EventSchema)