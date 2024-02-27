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
// test if the transporter has already been added a trip 
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
  
     // crating a new trip with the details 
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
  // adding +1 for every trip add successfully
  const transporter = await transporteur.findByIdAndUpdate({_id : req.user.id},
    { $inc: {numberofTrips : 1} }
    );
    if(!transporter){
      return res.status(400).send({
        message : "error while adding  the trip ",
        status :"fail",
        success : false,
       data :[]
      });
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
  // accepting the demande and changing the attrb to true 
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


 const transporter = await transporteur.findByIdAndUpdate({_id : req.user.id},
  { $inc: {numberofPackages : 1, numberofClient : 1} }
  );
  if(!transporter){
    return res.status(400).send({
      message : "error while adding package to the trip ",
      status :"fail",
      success : false,
     data :[]
    });
   }

// adding the package to the trip
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
 

   // adding +1 every time a new package add 
   const transport = await transporteur.findByIdAndUpdate({_id : req.user.id},
    { $inc: {numberofPackages : 1, numberofClient : 1} }
    );
    if(!transport){
      return res.status(400).send({
        message : "error while adding package to the trip ",
        status :"fail",
        success : false,
       data :[]
      });
     }


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
  // todo fix the problem of resending the photo of the package from the serveur to the user 
  return res.status(200).send({
    message : "List of packages for this trip", 
    status : "success",
    success : true,
    data : allPackage
  });

});





exports.getVerified = asyncHandler(async(req, res ,next)=>{

  // testing the input file and data 
  const {fullname , CIN , message, } = req.body;

  if(!name || !fullname|| !message){
    return res.status(400).send({
      message : "Please enter your information or message ",
      status : "fail", 
      success : false ,
      data :[],
    });
  }


  const passport_image = req.files.file;


  if(!passport_image){
     return res.status(404).send({
      message : "Please add a image of your passport ",
      success : false ,
      data :[],
      status : "fail"
     });


  }
  if(file.mimetype.startsWith('image')){
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
  req.body.passport_image = file.name;

  file.mv(`./Images/passport/${file.name}`);

  const demandeVerified = await verifiedModel.create(req.body);

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

 