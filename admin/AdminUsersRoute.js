const AdminUsersRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const Event = require('../models/EventModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')

AdminUsersRoute.get('/adminusers/show_all_users', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


    try {

        const users = await User.find()

        res.json({users})
        
    } catch (error) {
        next(error)
    }


}))

AdminUsersRoute.get('/adminusers/show_single/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {id} = req.params

   const user = await User.findById({_id: id})

   res.json({user})

        
    } catch (error) {
        next(error)
    }
}))

AdminUsersRoute.delete('/adminusers/delete_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    try {

        const{id} = req.params

        await User.findByIdAndDelete(id)

        res.json({msg: "user has been successfully deleted.."})
        
    } catch (error) {
        next(error)
    }
}))

AdminUsersRoute.put('/adminusers/update_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

    const {id} = req.params
     
    await User.findByIdAndUpdate(id, req.body, {new: true})

    res.json({msg: "user has successfully been updated"})

} catch (error) {
    next(error)
}

}))

AdminUsersRoute.get('/adminusers/show_user_events/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


    try {

        const {id} = req.params

        const userevent = await Event.find({eventOwner: id})

        res.json({userevent})
        
    } catch (error) {
        next(error)
    }

}))


module.exports = AdminUsersRoute