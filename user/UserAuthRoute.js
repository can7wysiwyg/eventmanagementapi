const UserAuthRoute = require('express').Router()
const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const userAllow = require('../middleware/userAllow')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });



module.exports =  UserAuthRoute