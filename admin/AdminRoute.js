const AdminRoute = require('express').Router()
const Admin = require('../models/AdminModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


AdminRoute.post('/admin/register', asyncHandler(async(req, res, next) => {

    try {
        
    } catch (error) {
        
    }




}) )


module.exports = AdminRoute