require('dotenv').config()
const port = process.env.PORT || 4500
const express = require('express')
const app =  express()
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const AdminAuthRoute = require('./admin/AdminAuthRoute')


mongoose.connect(process.env.MONGO_DEVT_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("connected to database");
  });


  app.use(cors())

  
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({extended: true, limit: '50mb'}))
  app.use(cookieParser())
  app.use(fileUpload({
    useTempFiles: true
}))
  

app.use(AdminAuthRoute)


app.listen(port, () => {
    console.log(`Your server is now running on port ${port}`);
})
