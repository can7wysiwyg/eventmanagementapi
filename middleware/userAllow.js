const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')

const userAllow = asyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        _id: req.user.id
    })


    

    if(user.role !==8 ) return res.json({msg: "you do not have permission for the task.."})

    next()


})

module.exports = userAllow