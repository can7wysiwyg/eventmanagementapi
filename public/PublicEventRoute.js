const PublicEventRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Event = require('../models/EventModel')
const Category = require('../models/CategoryModel')



PublicEventRoute.get('/publicevent/show_all_events', asyncHandler(async(req, res, next) => {

    try {

        const events = await Event.find()

        res.json({events})

        
    } catch (error) {
        next(error)
    }


}))


PublicEventRoute.get('/publicevent/show_new_events', asyncHandler(async(req, res, next) => {

    try {

        const events = await Event.find().sort({ _id: -1 }).limit(2)

        res.json({events})

        
    } catch (error) {
        next(error)
    }


}))



PublicEventRoute.get('/publicevent/show_one_event/:id', asyncHandler(async(req, res, next) => {


    try {
        const{id} = req.params

        const event = await Event.findById({_id: id})

        res.json({event})
        
    } catch (error) {
        next(error)
    }

}))

PublicEventRoute.get('/publicevent/show_by_category/:id', asyncHandler(async(req, res, next) => {

try {
    const {id} = req.params

    const eventbycat = await Event.find({catname: id})

    res.json({eventbycat})
    
} catch (error) {
    next(error)
}

}))

PublicEventRoute.get('/publicevent/event_categories', asyncHandler(async(req, res, next) => {

    try {

        const categories = await Category.find()

        res.json({categories})
        
    } catch (error) {
        next(error)
    }

}))



module.exports = PublicEventRoute

