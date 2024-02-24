const asyncHandler = require('../middleware/asynchandller');
const transporteur = require('../model/transportorModel');
const fs = require("fs");
const tripModel =require('../model/tripModel');
const demandeDelv = require('../model/demandeDelv');



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



// add trip annonce 

exports.addTrip = asyncHandler(async(req, res, next) => {

  const test = await tripModel.findById(
    res.user.id,
    ).where({
    isDone : false,
  });
  if(test){
    return res.status(203).send({
      status : "fail",
      success : false ,
      message : 'You cannot add trip twice ',
    })

  }
    const trip= await tripModel.create(req.body, {
     runvalidate : true
  });

  if(!trip){
    return res.status(203).send({
      status : "fail",
      success : false ,
      message : 'You cannot add trip twice ',
    })

  }


  res.status(200).send({
    success : true , 
    status: "success", 
    message : "You have posted a trip successfuly"
  });


});



// get all demandes for the transporter 
exports.getAlldemande = asyncHandler(async(req, res, next) => {

 const alldemandes = await demandeDelv.find(
  {transporter : res.user.id}
  );
   if(!alldemandes){

    return res.status(403).send({
      message : "bad request",   
      success : false,
       status : "fail",
       data :[],

    });
   }


   return res.status(200).send({
    message : "Liste of request",   
    success : true,
     status : "success",
     data :alldemandes,

  });


});


// acceptation des demande 
exports.acceptDemande = asyncHandler(async(req, res, next)=>{

 const demandeaccepte = await demandeDelv.findByIdAndUpdate(
  {client:req.body.id},
  {
  accepted : true, 
  
 });

 if(!demandeaccepte){

  return res.status(400).send({
    message : "error while accepting this request",
    status :"fail",
    success : false,
   data :[]
  });
 }



 const addPackageTo_theTrip = await tripModel.findById(
  {
    transporter: demandeaccepte.transporter,
  },
 
 ).where(isDone == false);


 if(!addPackageTo_theTrip){
  return res.status(400).send({
    message : "error seatching for trip",
    status :"fail",
    success : false,
   data :[]
  });
 }

   addPackageTo_theTrip.packages.push(demandeaccepte);
   addPackageTo_theTrip.save();


   return res.status(200).send({
    message : "demande accepted and package add to the List successfuly",
    success : true,
    status :"success",
    data : addPackageTo_theTrip
  });
});

// refuse de demande 
exports.refusedemande = asyncHandler(async(req, res, next)=>{
 
  const refuse = await demandeDelv.findByIdAndUpdate({
    id : req.body.id,
  }, 
  {  refuse : true,
  },  );



  if(!refuse){
    return res.status(400).send({
      message : "error in while refusing the request ",
      status :"fail",
      success : false,
     data :[]
    });
  }


  return res.status(200).send({
    message : "request have been refused",
    status :"success",
    success : true,
   data :[]
  });

   



}); 


// get all packages for the current trip 
exports.getAllPackage_forSingleTrip = asyncHandler(async(req, res ,next)=>{

  const allPackage = await tripModel.find({
    transporter : res.user.id,
    isDone : false ,
  });
  if(!allPackage){
    return res.status(404).send({
      message : "No trip for the moment", 
      status : "fail",
      success : false,
      data : []
    });
  }
  return res.status(200).send({
    message : "List of packages for this trip", 
    status : "success",
    success : true,
    data : allPackage
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





 