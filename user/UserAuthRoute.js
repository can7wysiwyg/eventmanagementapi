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


  UserAuthRoute.post('/user/register', asyncHandler(async(req, res, next) => {


    try {

      const {fullname, email, password, } = req.body

      if(!fullname) res.json({msg: "name cannot be empty"})

      if(!email) res.json({msg: "email cannot be empty"})

      if(!password) res.json({msg: "password cannot be empty"})


      const emailExists = await  User.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists, please user another one or login" });
    }

    if (!req.files || !req.files.userImage) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const file = req.files.userImage;
    
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'eventImages',
        width: 500,
        height: 500,
        crop: "fill"
      }, async (err, result) => {
        if (err) {
          console.error("Error uploading  image:", err);
          return res.status(500).json({ msg: "Failed to upload  image" });
        }
    
        removeTmp(file.tempFilePath);
    
        await User.create({
          fullname,
          email,
            userImage: result.secure_url,
          password: hashedPassword
        });
    
        res.json({ msg: "account created successfully created!" });
      });








      
    } catch (error) {
      next(error)
    }

  }))



UserAuthRoute.post('/user/login', asyncHandler(async(req, res, next) => {

try {

  const {email, password} = req.body

  const userExists = await User.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "No user associated with this email exists in our system. Please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
    
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.USER_REFRESH_TOKEN, (err, user) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const accesstoken = createAccessToken({id: user.id})
        
    
        res.json({accesstoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


  
} catch (error) {
  next(error)
}

}))


UserAuthRoute.get('/user/user',verify, asyncHandler(async(req, res) => {
  try{
    const user = await User.findById(req.user).select('-password')
    if(!user) return res.status(400).json({msg: "User does not exist."})
  
    res.json(user)
  
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))







  const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.USER_ACCESS_TOKEN, {expiresIn: '7d'})
  }
  const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.USER_REFRESH_TOKEN, {expiresIn: '7d'})
  }
  


module.exports =  UserAuthRoute


function removeTmp(filePath) {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
}