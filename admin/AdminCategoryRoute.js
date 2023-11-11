const AdminCategoryRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Category = require('../models/CategoryModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')



AdminCategoryRoute.post('/admincategory/make_category', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

    const {catName} = req.body

    if(!catName) res.json({msg: "category name cannot be empty"})

    const category = await Category.create({
        catName
    })

    res.json({category})
    
} catch (error) {
    next(error)
}

}))


AdminCategoryRoute.put('/admincategory/update_category/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

    const {id} = req.params

    await Category.findByIdAndUpdate(id, req.body, {new: true})
    res.json({msg: "updated successfully"})
    
} catch (error) {
    next(error)
}


}))

AdminCategoryRoute.delete('/admincategory/update_category/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {
    
        const {id} = req.params
    
        await Category.findByIdAndDelete(id)
        res.json({msg: "deleted successfully"})
        
    } catch (error) {
        next(error)
    }
    
    
    }))
    

AdminCategoryRoute.get('/admincategory/view_one/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {
        const {id} = req.params

        const category = await Category.findById({_id: id})

        res.json({category})
        
    } catch (error) {
        next(error)
    }

}))


module.exports = AdminCategoryRoute