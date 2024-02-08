const asyncHandler = require('../middleware/asynchandller');
const transporteur = require('../model/transportorModel');
const fs = require("fs");




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

 const transporteurs = await transporteur.findByIdAndUpdate(req.body,
   {
     runvalidate : true , 
     new : true});

 if(!transporteurs){

   return res.status(404).send({
     success : false ,
     message : "transporteur not found",
     data : []
   });


 }
 return res.status(200).send({
   success : true ,
   message : "transporteur updated successfully",
   data : transporteurs
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
   `./images/private/transporteurs/${file.name}`,
    
   );


      // if the user have a profile picture already delete it from the serveur 
   if(req.user.profilePicture !== "default.png"){
     fs.unlink(`./images/private/transporteurs/${req.user.profilePicture}`, (err) => {
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
   const transporteurs = await transporteur.findByIdAndUpdate(
     req.user.id,
     {profilePicture : file.name},
     {
       runvalidate : true , 
       new : true
     }
     );

     return res.status(200).send({
       success : true ,
       message : "Profile picture updated successfully",
       data : transporteurs
     });







});




 