const asyncHandler = require('../middleware/asynchandller');
const userModel = require('../model/userModel');
const demande = require('../model/demandeDelv');
const fs = require("fs");
const path = require('path');
// updating user data name email

exports.updateUserDetails= asyncHandler(async(req, res , next) => {
   
   if(req.body.password){
    return res.status(400).send({
      success : false ,
      message : "You can't update password from here",
      data : []
    });
   }
  
  if (!req.body){
    return res.status(400).send({
      success : false ,
      message : "Please enter the data you want to update",
      data : []
    });
  }

  const user = await userModel.findByIdAndUpdate(req.body,
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

   if(file.mimetype.startsWith("image")){
    return res.status(400).send({
      success : false ,
      message : "Please upload an image file  ex : jpg, jpeg, png",
      data : []
    });
   }
     
   // upload the new profile picture on the serveur 
   file.name = `photo_${req.user.id}${path.parse(file.name).ext}`;
    file.mv(
    `./images/private/users/${file.name}`,
     
    );


       // if the user have a profile picture already delete it from the serveur 
    if(req.user.profilePicture !== "default.png"){
      fs.unlink(`./images/private/users/${req.user.profilePicture}`, (err) => {
        if (err) {
          console.error(err)
          return  res.status(400).send({
            success : false ,
            message : "error updating profile picture",
            data : []
          });
        }
      });
  
  
  
     }

      // updating the new profile picture in the database 
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {profilePicture : file.name},
      {
        runvalidate : true , 
        new : true
      }
      );







});


// get all transporteurs from the database 

exports.getallTransportors = asyncHandler(async(req, res, next) => {


  const transportors = await transporteurs.find();


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


   const file = req.files.file ;
   if(!file){
    return res.status(404).send({
      success : false , 
      status : "fail",
      message : "Please add the images of the packages"
    });
   }
   if(! file.mimetype.startsWith("image")){
    return res.status(404).send({
      success : false , 
      status : "fail",
      message : "Please add file type image png jpeg jpg "
    });
   }
   if(file.size> 1000000){

    return res.status(404).send({
      success : false , 
      status : "fail",
      message : "Ops! size is to big "
    });
   }
   file.name = `package_${res.user.id}${path.parse(file.name).ext}`;
   file.mv(
       `./Images/packages/demandeimage/${file.name}`
   );


   req.body.message.packagephoto = file.name;
 


   const user_demande = await demande.create(req.body, {
    runvalidate : true,

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


  




