const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/AdminModel')

const verifyAdmin = asyncHandler(async (req, res, next) => {
  let adminToken

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      adminToken = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(adminToken, process.env.ADMIN_ACCESS_TOKEN)

      // Get user from the token
      req.admin = await Admin.findById(decoded.id).select('-adminPassword')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!adminToken) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = verifyAdmin 


