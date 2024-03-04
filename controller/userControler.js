const asyncHandler = require('../middleware/asynchandller');
const userModel = require('../model/userModel');
const demande = require('../model/demandeDelv');
const verified = require("../model/verifiedDemande");
const fs = require("fs");
const path = require('path');
const tripModel = require('../model/tripModel') ;
const transporteur = require("../model/transportorModel");
const { json } = require('express');
// updating user data name email

exports.updateUserDetails= asyncHandler(async(req, res , next) => {
  if(!req.body.data){
    return res.status(404).send({
      message : "please enter your info",
      success : false,
      data:[]
    })
  }
  let request = JSON.parse(req.body.data);
   
   if(req.body.data.password){
    return res.status(400).send({
      success : false ,
      message : "You can't update password from here",
      data : []
    });
   }
  
  
  const file = req.files.file;
  if(!file){
    return res.status(400).send({
      success : false ,
      message : "Please upload a photo",
      data : []
    });
  }

  if(file.size> 1000000){
    return res.status(400).send({
      success : false ,
      message : "File size should not exceed 1MB",
      data : []
    });
  }
  file.name = `user_${req.user.id}${path.parse(file.name).ext}`;
   request.profilePicture = file.name;
   file.mv(`./Images/private/users/${file.name}`);
   
  const user = await userModel.findByIdAndUpdate(req.user.id,
    request,
    {
      runvalidate : true , 
      new : true});

  if(!user){

    return res.status(404).send({
      success : false ,
      message : "User not found",
      data : []
    });


  }
  return res.status(200).send({
    success : true ,
    message : "User updated successfully",
    data : user
  })


});


// uploading a profile picture

exports.uploadProfilePicture = asyncHandler(async(req, res, next) => {
const file = req.files.file;
 
  
   if(!file){
    return res.status(400).send({
      success : false ,
      message : "Please upload a file",
      data : []
      
    });
   }
  
   if(file.size> 1000000){
    return res.status(400).send({
      success : false ,
      message : "File size should not exceed 1MB",
      data : []
    });
   }



       // if the user have a profile picture already delete it from the serveur 
       if(req.user.profilePicture !== "default.jpg"){
        fs.unlink(`./Images/private/users/${req.user.profilePicture}`, (err) => {
          if (err) {
            console.error(err)
            return  res.status(400).send({
              success : false ,
              message : "error updating  picture",
              data : []
            });
          }
        });

    
    
    
       }
     
   // upload the new profile picture on the serveur 
   file.name = `user_${req.user.id}${path.parse(file.name).ext}`;
    file.mv(
    `./Images/private/users/${file.name}`,
     
    );


      // updating the new profile picture in the database 
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {profilePicture : file.name},
      {
        runvalidate : true , 
        new : true
      }
      );
      if(!user){
        return res.status(400).send({
          success : false ,
          message : "error updating profile picture",
          data : []
        });
      }
      return res.status(200).send({
        message: "Profile picture updated successfully",
        success : true ,
        data : user
      });







});


// get all transporteurs from the database 

exports.getallTransportors = asyncHandler(async(req, res, next) => {


  const transportors = await transporteur.find();


   if(!transportors){
     return res.status(404).send({
       success : false ,
       message : "No transportors found",
       data : []
     });
   }


   return res.status(200).send({
     success : true ,
     message : "Transportors found",
     data : transportors
   });



});



// send a request to the transporter to accepot the package

 

exports.sendRequest = asyncHandler(async(req, res, next)=>{
//! convert the request to an object 
if(!req.body.data){
  return res.status(404).send({
    message : "please enter the info request",
    success : false,
    data:[]
  })
}
let result = JSON.parse(req.body.data);

   const file = req.files.file ;
   if(!file){
    return res.status(404).send({
      success : false , 
      status : "fail",
      message : "Please add the images of the packages"
    });
    
   }
   if(file.size> 1000000){

    return res.status(404).send({
      success : false , 
      status : "fail",
      message : "Ops! size is to big "
    });

   }
   file.name = `package_${req.user.id}${path.parse(file.name).ext}`;
   
   file.mv(
       `./Images/packages/demandeimage/${file.name}`
   );


   result.message.packagephoto = file.name;
 


   const user_demande = await demande(result).save({
    runvalidate : true
   });

   if(!user_demande){
    return res.status(203).send(
      {
        status: "fail", 
        success : false ,
        data:[] ,
        message :" Ops ! we coudn't create your request duo to an error in the request"
      }
    );
   }


   res.status(201).send({
    status : "success", 
    message : "Request have sent successfuly ",
    data :[],
   });
});


exports.getVerified = asyncHandler(async(req, res ,next)=>{
  if(!req.body.data){
    return res.status(404).send({
      message : "please enter your info",
      success : false,
      data:[]
    });
  }
//! convert the req to an object because it came in String format 
let result = JSON.parse(req.body.data);
//! adding the client id to the object 
 result.demander_id= req.user.id;

  const file = req.files.file;
  
  if(!file){
     return res.status(404).send({

      message : "Please add a image of your passport ",
      success : false ,
      data :[],
      status : "fail"
     });


  }
  if(file.size>1000000){
    return res.status(404).send({

      message : "image of your passport must be under 1MB ",
      success : false ,
      data :[],
      status : "fail"
     });
  }

 file.name = `passport_${req.user.id}${path.parse(file.name).ext}`
  
  //! then adding the image name to the ressult of tthe convert 
  result.passport_image = file.name;
  //! move the image to the directory
  file.mv(`./Images/passport/${file.name}`);
  


  const demandeVerified = await verified.create(result)


    if(!demandeVerified){
      return res.status(404).send({
        message: "Error while creating the request",
        success : false, 
        status : "fail",
        data:[]
      });
    }

    return res.status(200).send({
      message : "Your request has been sended to the admins ",
      success : true , 
      status : "success",
      data :[],
    });

   


});


// search for a specific trip 
exports.searchForTrip = asyncHandler(async(req,  res, next)=>{

  try {
    let query;

    // Copy the req.query object
    const reqQuery = { ...req.query };





    

    // Fields to exclude from filtering
    const removeFields = ["select", "sort"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = tripModel.find(JSON.parse(queryStr));   

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("createdAt");
    }

    return res.status(200).send({
      message : "we found some results",
      status : "success",
      success : true,
      data :query,
    });

  


   
} catch (err) {
    
    return res.status(500).send({ 
      success: false, message: "Server Error",
    data:[] });
}
});


  

// ajputer un commntaire et review pour un transporteur
exports.addComment =asyncHandler(async(req, res, next)=>{})


