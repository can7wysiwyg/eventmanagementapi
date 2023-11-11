const UserEventRoute = require('express').Router()
const Event = require('../models/EventModel')
const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const userAllow = require('../middleware/userAllow')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const { log } = require('console')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


UserEventRoute.post('/userevent/create_event', verify, userAllow, asyncHandler(async(req, res, next) => {

try {
const {eventName, eventOwner, eventDate, eventDescription, eventPrice, eventLocation, catname} = req.body 

if(!eventName) res.json({msg: "event name cannot be empty"})

if(!eventOwner) res.json({msg: "event's owner cannot be empty"})

if(!eventDate) res.json({msg: "event date cannot be empty"})

if(!eventDescription) res.json({msg: "event description cannot be empty"})

if(!eventPrice) res.json({msg: "event price cannot be empty"})

if(!eventLocation) res.json({msg: "event location cannot be empty"})
if(!catname) res.json({msg: "category name cannot be empty"})

if (!req.files || !req.files.eventPoster) {
    return res.status(400).json({ message: 'No file uploaded' });
  }


  const file = req.files.eventPoster;


  cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'eventImages',
    width: 700,
    height: 700,
    crop: "fill"
  }, async (err, result) => {
    if (err) {
      console.error("Error uploading  image:", err);
      return res.status(500).json({ msg: "Failed to upload  image" });
    }

    removeTmp(file.tempFilePath);

    await Event.create({
        eventName,
        eventOwner,
        eventDescription,
        eventDate,
        eventLocation,
        eventPrice,
        catname,
        eventPoster: result.secure_url,
      
    });

    res.json({ msg: "you have successfully created an event!" });
  });


} catch (error) {
    next(error)
}


}) )


UserEventRoute.get('/userevent/show_single/:id', verify, userAllow, asyncHandler(async(req, res, next) => {

try {
    const {id} = req.params
    const owner = await User(req.user)

    const user = owner._id.toString()

    const getOwner = await Event.findOne({_id: id})
         
       const ownedBy = getOwner.eventOwner

       if( user !== ownedBy ) {
        res.json({msg: "intruder alert..."})
       }




    const event = await Event.findById({_id: id})

res.json({event})

} catch (error) {
    next(error)
}


}))


UserEventRoute.get('/userevent/my_events/:id', verify, userAllow, asyncHandler(async(req, res, next) => {

    try {

        const {id} = req.params
    const owner = await User(req.user)

    const user = owner._id.toString()

    const getOwner = await Event.findOne({eventOwner: id})

    if(getOwner === null) {

        res.json({msg: "you have not posted any events"})
    }
    
    // console.log(getOwner)

    // res.json({getOwner})
         
       const ownedBy = getOwner.eventOwner

       if( user !== ownedBy ) {
        res.json({msg: "intruder alert..."})
       }




const myevents = await Event.find({eventOwner: id})

res.json({myevents})
        
    } catch (error) {
        next(error)
    }


}))

UserEventRoute.put('/userevent/update_my_event/:id', verify, userAllow, asyncHandler(async(req, res, next) => {

try {

    const {id} = req.params
    const owner = await User(req.user)

    const user = owner._id.toString()

    const getOwner = await Event.findById({_id: id})

    // console.log(getOwner)

    // res.json({getOwner})

    if(getOwner === null) {

        res.json({msg: "something wrong happened"})
    }

    const ownedBy = getOwner.eventOwner

       if( user !== ownedBy ) {
        res.json({msg: "intruder alert..."})
       }
    
   const newevent = await Event.findByIdAndUpdate(id, req.body, {new: true})

   res.json({msg: newevent})

    

} catch (error) {
    next(error)
}

}))


UserEventRoute.delete('/userevent/update_my_event/:id', verify, userAllow, asyncHandler(async(req, res, next) => {

    try {
    
        const {id} = req.params
        const owner = await User(req.user)
    
        const user = owner._id.toString()
    
        const getOwner = await Event.findById({_id: id})
    
    
        if(getOwner === null) {
    
            res.json({msg: "something wrong happened"})
        }
    
        const ownedBy = getOwner.eventOwner
    
           if( user !== ownedBy ) {
            res.json({msg: "intruder alert..."})
           }
        
        await Event.findByIdAndDelete(id)
    
       res.json({msg: "successfully deleted"})
    
        
    
    } catch (error) {
        next(error)
    }
    
    }))

    UserEventRoute.put('/userevent/update_poster', verify, userAllow, asyncHandler(async(req, res, next) => {


try {

    const {id} = req.params
        const owner = await User(req.user)
    
        const user = owner._id.toString()
    
        const getOwner = await Event.findById({_id: id})
    
    
        if(getOwner === null) {
    
            res.json({msg: "something wrong happened"})
        }
    
        const ownedBy = getOwner.eventOwner
    
           if( user !== ownedBy ) {
            res.json({msg: "intruder alert..."})
           }


           const eventposter = await Event.findById(id);

      if (!eventposter) {
        return res.status(404).json({ msg: " not found." });
      }

      if (eventposter.eventPoster) {
        const publicId = eventposter.eventPoster.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      const eventPoster = req.files.eventPoster;

      const result = await cloudinary.uploader.upload(eventPoster.tempFilePath);

      eventposter.eventPoster = result.secure_url;

      await eventposter.save();

      fs.unlinkSync(bookImage.tempFilePath);

      res.json({ msg: "Book picture updated successfully." });

        


    
} catch (error) {
    next(error)
}



    }))



    UserEventRoute.delete('/userevent/delete_my_events/:id', verify, userAllow, asyncHandler(async(req, res, next) => {


        try {
            const {id} = req.params

            const owner = await User(req.user)
    
        const user = owner._id.toString()
    
        const getOwner = await Event.findOne({eventOwner: id})
    
    
        if(getOwner === null) {
    
            res.json({msg: "something wrong happened"})
        }
    
        const ownedBy = getOwner.eventOwner
    
           if( user !== ownedBy ) {
            res.json({msg: "intruder alert..."})
           }


           const deletemyevents = await Event.deleteMany({eventOwner: id})

           res.json({msg: deletemyevents})




            
        } catch (error) {
            next(error)
        }

    }))
    


module.exports = UserEventRoute

function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }