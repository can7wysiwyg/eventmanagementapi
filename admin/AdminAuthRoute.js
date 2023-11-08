const AdminAuthRoute = require('express').Router()
const Admin = require('../models/AdminModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const verifyAmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


  AdminAuthRoute.post('/admin/register', asyncHandler(async(req, res, next) => {

    try {

      const {adminName, adminPassword, adminEmail} = req.body

      if(!adminName) res.json({msg: "admin name cannot be empty"})

      if(!adminPassword) res.json({msg: " password cannot be empty"})

      if(!adminEmail) res.json({msg: "email cannot be empty"})

      const adminEmailExists = await  Admin.findOne({ adminEmail });

      if (adminEmailExists) {
        res.json({ msg: "This email already exists." });
      }
  
      if (!req.files || !req.files.adminImage) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
        const file = req.files.adminImage;
      
        cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'eventImages',
          width: 400,
          height: 400,
          crop: "fill"
        }, async (err, result) => {
          if (err) {
            console.error("Error uploading  image:", err);
            return res.status(500).json({ msg: "Failed to upload  image" });
          }
      
          removeTmp(file.tempFilePath);
      
          await Admin.create({
            adminName,
            adminEmail,
           adminImage: result.secure_url,
            adminPassword: hashedPassword
          });
      
          res.json({ msg: "log in!" });


        })
  



        
    } catch (error) {
        next(error)
    }




}) )

AdminAuthRoute.post('/admin/login', asyncHandler(async(req, res, next) => {


  try {

    const{ adminEmail, adminPassword } = req.body

    if(!adminEmail) res.json({msg: "email is required to log in..."})

    if(!adminPassword) res.json({msg: "password is required to log in..."})


    const adminExists = await Admin.findOne({ adminEmail }).select("+adminPassword");
    

    if (!adminExists) {
      res.json({
        msg: "login with a valid email address.",
      });
    }

    const passwordMatch = await bcrypt.compare(adminPassword, adminExists.adminPassword);

    if (passwordMatch) {
      
      let refreshtoken = createRefreshToken({id: adminExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.ADMIN_REFRESH_TOKEN, (err, admin) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const accesstoken = createAccessToken({id: admin.id})
        
    
        res.json({accesstoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 




    
  } catch (error) {
    next(error)
  }


}) )


AdminAuthRoute.get('/admin/show_admin', verifyAmin, asyncHandler(async(req, res, next) => {

try {

  const admin = await Admin.findById(req.admin).select('-adminPassword')
      if(!admin) return res.status(400).json({msg: "Unknowns"})
    
      res.json(admin)
    


  
} catch (error) {
  next(error)
}


})) 



const createAccessToken = (admin) =>{
  return jwt.sign(admin, process.env.ADMIN_ACCESS_TOKEN, {expiresIn: '7d'})
}
const createRefreshToken = (admin) =>{
  return jwt.sign(admin, process.env.ADMIN_REFRESH_TOKEN, {expiresIn: '7d'})
}



module.exports = AdminAuthRoute


function removeTmp(filePath) {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
}