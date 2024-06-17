const asyncHandler = require('../middleware/asynchandller');
const transporteur = require('../model/transportorModel');
const fs = require("fs");
const tripModel =require('../model/tripModel');
const demandeDelv = require('../model/demandeDelv');
const path = require("path");
const historymodel = require("../model/historyTrip");
const MessageModel = require ("../model/messageModel");
const verified= require('../model/verifiedDemande');
const ContactAdmin =require('../model/ContactAdmin');
const mongoose = require('mongoose');
const {sendNotifcationToDevice}= require("../controller/pushNotificationController")
// updating user data name email

exports.updateUserDetails= asyncHandler(async(req, res , next) => {

  let request = JSON.parse(req.body.data);
  // *! if the user has sent a pic to update

  if (req.files && req.files.file) {
    const file = req.files.file;
    //  check the   image size
    if (file.size > 1000000) {
      return res.status(400).send({
        success: false,
        message: "File size should not exceed 1MB",
        data: [],
      });
    }

    // if the user have a profile picture already delete it from the serveur
    if (req.user.profilePicture !== "default.jpg") {
      fs.unlink(`./Images/private/transporteurs/${req.user.profilePicture}`, (err) => {
        if (err) {
          console.error(err);
          return res.status(400).send({
            success: false,
            message: "error updating  picture",
            data: [],
          });
        }
      });
    }

    // upload the new profile picture on the serveur
    file.name = `transporteurs_${req.user.id}${path.parse(file.name).ext}`;
    file.mv(`./Images/private/transporteurs/${file.name}`);

    // updating the new profile picture in the database
    const user = await transporteur.findByIdAndUpdate(
      req.user.id,
      { profilePicture: file.name },
      {
        runvalidate: true,
        new: true,
      }
    );
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "error updating profile picture",
        data: [],
      });
    }
  }

  if (request.password) {
    return res.status(400).send({
      success: false,
      message: "You can't update password from here",
      data: [],
    });
  }

  const finaluser = await transporteur.findByIdAndUpdate(req.user.id, request, {
    runvalidate: true,
    new: true,
  });

  if (!finaluser) {
    return res.status(404).send({
      success: false,
      message: "User not found",
      data: [],
    });
  }
  return res.status(200).send({
    success: true,
    message: "User updated successfully",
    data: finaluser,
  });

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
    fs.unlink(`./Images/private/transporteurs/${req.user.profilePicture}`, (err) => {
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
  file.name = `transporteur_${req.user.id}${path.parse(file.name).ext}`;
   file.mv(
   `./images/private/transporteurs/${file.name}`,
    
   );
 

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
  console.log(req.body);
// test if the transporter has already been added a trip 
  const test = await tripModel.findOne(
   {transporter: req.user.id,
    isDone : false}
    );
  if(test){
    
    return res.status(203).send({
      status : "fail",
      success : false ,
      message : 'You cannot add trip twice ',
    })

  }
  // adding +1 for every trip add successfully
  const transporter = await transporteur.findByIdAndUpdate({
    _id : req.user.id
  },
    { $inc: {numberofTrips : 1} },
    
    
    );
    if(!transporter){
      return res.status(400).send({
        message : "error while adding  the trip ",
        status :"fail",
        success : false,
       data :[]
      });
     }
   
     req.body.transporter = req.user.id;
     // crating a new trip with the details
      if(!req.body.transporter || !req.body.Citys){
        return res.status(400).send({
          success : false,  
          message : "error while adding the the trip due to missings fileds",
          data:[],
        });
      }
    const trip= await tripModel({
      transporter: req.user.id,
      Citys: req.body.Citys,
      Home_pick_up : req.body.home_pick_up,
      Home_delivery : req.body.Home_delivery
    });
    trip.save();
    

  
  if(!trip){
    return res.status(203).send({
      status : "fail",
      success : false ,
      message : 'error while adding the trip',
    })

    
  }
  
   
 return res.status(200).send({
    success : true , 
    status: "success", 
    message : "You have posted a trip successfuly",
   
  });


});



// get all demandes for the transporter 
exports.getAlldemande = asyncHandler(async(req, res, next) => {

 const alldemandes = await demandeDelv.find(
  {
    transporter : req.user.id
  }

  ).populate(
    'Client').populate('transporter');
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
  {_id: req.params.id },
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
 
 //convert the number and the price to numbers
 const numberofkg = parseFloat(demandeaccepte.message.numberofkg);
  const price_kg = parseFloat(req.user.price_kg);

   // ! calculating the amount and adding it to the transporter revenu 
const amount = numberofkg * price_kg;




 const transporter = await transporteur.findByIdAndUpdate({_id : req.user.id},
  { $inc: {numberofPackages : 1, numberofClients : 1, totalRevenue: amount} }
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
const addPackageTo_theTrip = await tripModel.findOneAndUpdate(
  { transporter: req.user.id, isDone: false },
  {
    $push: { packages: demandeaccepte },
    $inc: { numberofpackage: 1 }
  },
  { new: true } // To return the updated document
);



 if(!addPackageTo_theTrip){
  return res.status(400).send({
    message : "error searching for trip",
    status :"fail",
    success : false,
   data :[]
  });
 }

   return res.status(200).send({
    message : "demande accepted and package add to the List successfuly",
    success : true,
    status :"success",
    data : []
  });
});

// refuse de demande 
exports.refusedemande = asyncHandler(async(req, res, next)=>{
 
  const refuse = await demandeDelv.findByIdAndUpdate({
    _id : req.params.id,
  }, 
  {  refused : true,
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

  const allPackage = await tripModel.findOne({
    transporter : req.user.id,
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
    data : allPackage.packages
  });

});





exports.getVerified = asyncHandler(async(req, res ,next)=>{
    console.log(req.body.data);
  if (!req.body.data) {
    return res.status(404).send({
      message: "please enter your info",
      success: false,
      data: [],
    });
  }
  //! convert the req to an object because it came in String format
  let result = JSON.parse(req.body.data);
  //! adding the client id to the object
  result.userId = req.user.id;

  const file = req.files.file;

  if (!file) {
    return res.status(404).send({
      message: "Please add a image of your passport ",
      success: false,
      data: [],
      status: "fail",
    });
  }
  if (file.size > 1000000) {
    return res.status(404).send({
      message: "image of your passport must be under 1MB ",
      success: false,
      data: [],
      status: "fail",
    });
  }
  const twelveDigitNumber = Math.floor(1000000000 + Math.random() * 900000000000);

  file.name = `passport_${twelveDigitNumber}${path.parse(file.name).ext}`;

  //! then adding the image name to the ressult of tthe convert
  result.passport_image = file.name;
  //! move the image to the directory
  file.mv(`./Images/passport/${file.name}`);

  const demandeVerified = await verified.create(result);

  if (!demandeVerified) {
    return res.status(404).send({
      message: "Error while creating the request",
      success: false,
      status: "fail",
      data: [],
    });
  }

  return res.status(200).send({
    message: "Your request has been sended to the admins ",
    success: true,
    status: "success",
    data: [],
  });


});

// update trip
exports.updateTrip = asyncHandler(async(req, res, next) => {
  
  const citysData = req.body.Citys;

  // Ensure each entry in Citys has a valid _id
  citysData.forEach(city => {
    if (!city._id || !mongoose.Types.ObjectId.isValid(city._id)) {
      city._id = new mongoose.Types.ObjectId();
    }
  });


  const updatedTrip = await tripModel.findByIdAndUpdate(
    req.params.id,
    { Citys: citysData },
    {
      runValidators: true,
      new: true
    }
  ).populate("transporter");

  if (!updatedTrip) {
    return res.status(404).send({
      message: "Error while updating the trip",
      success: false,
      status: "fail",
      data: []
    });
  }

  return res.status(200).send({
    message: "Trip updated successfully",
    success: true,
    status: "success",
    data: updatedTrip
  });
});



// delete the current trip 
exports.deleteTrip = asyncHandler(async(req, res, next)=>{
  
// first retiving all the user id that aere in the current trip AN DTHEN SEND 
//  notification for the user to notify them aboutt the chanege that have been mad
  const aggregationPipeline = [
    {
      $match: {
        _id: req.params.id,
      }
    },
    {
      $unwind: "$packages"
    },
    {
      $group: {
        _id: null,
        ClientIds: { $addToSet: "$packages.Client" }
      }
    },
    {
      $project: {
        _id: 0,
        ClientIds: 1
      }
    }
  ];

  const userInTheTrip = await tripModel.aggregate(aggregationPipeline);
  
  console.log(userInTheTrip);

 // sending notification :
     sendNotifcationToDevice(userInTheTrip);
     
   /// after sending notification to the user , delete the trip 
  const tripdeleted = await tripModel.findByIdAndDelete(req.params.id);
   
  if(!tripdeleted){
    return res.status(404).send({
      message : "error while deleting trip",
      success : false, 
      status :"fail",
      data:[],
    })
  }

  return res.status(200).send({
    message : "trip deleted successfully",
    success : true, 
    status :"success",
    data:[],
  })


});

exports.addSinglePackage = asyncHandler(async(req, res, next)=>{
    
  //! add a default photo to the package beacuse the transporter 
  //!is the one that add this package with no photo
      req.body.packagephoto = "default.png";
  const package = await tripModel.findByIdAndUpdate(req.params.id,{
    $push : {self_packages : req.body},
    $inc : {numberofpackage :1}
   });

    if(!package){
      return res.status(404).send({
        message : "error while adding package to the trip ",
        success : false,
        status :"fail",
        data :[]
      });
    }
    //! calculate the revenu of the package and add to the data base
    
    const transporterupdate = await transporteur.findByIdAndUpdate(req.user.id,
      {
        $inc :{ numberofPackages:1,numberofClients : 1, totalRevenue: req.body.amount}

      });
      if(!transporterupdate){
        return res.status(404).send({
          message : "user not found to update ",
          success : false ,
          status : 'fail',
          data:[]
        })
      }
      


    return res.status(200).send({
      message : "package added to the trip successfuly",
      success : true,
      status :"success",
      data :[]
    });



  
});
// add trip to the history when the trip ends 
exports.addTripToHistory = asyncHandler(async(req, res, next)=>{

const trip = await tripModel.findByIdAndUpdate(req.params.id,
  {
    isDone : true,
  });
  if(!trip){
    return res.status(404).send({
      message: "trip not found to update",
      status: 'fail',
      success : false,
      data:[]

    });

  }
  

  const history = await historymodel.create({
    transporter:trip.transporter,
    Citys: trip.Citys, 
    Home_pick_up: trip.Home_pick_up,  
    Home_delivery: trip. Home_delivery , 
    packages: trip.packages ,
    self_packages :trip.self_packages,
    isDone: trip.isDone ,
    createdAt : trip.createdAt
  });
   

   if(!history){
    return res.status(404).send({
      message  : "cannot add trip to history",
      success : false,
      status : 'fail',
      data:[]
    });
   }


   const deletetrip = await tripModel.findOneAndDelete(
    {
      transporter: req.user.id,
      
    }
  );
   if(!deletetrip){
    return res.status(404).send({
      message : " error while deleting trip but add to the history list"
       ,success : false ,
    });
   }


   return res.status(200).send({
    message : "trip add to the history list in your settings successfuly",
    status : "sucess",
    success : true ,
    data:[]

   });
  })


  //  get historique list for current transporter
  exports.gethistorylist = asyncHandler(async(req, res, next)=>{
     const listofTrip = await historymodel.find({
      transporter: req.user.id
     }).populate("transporter",);
     if(!listofTrip){
      return res.status(404).send({
        success : false, 
        message : "error while getting history list",
        status : "fail",
        data:[]
      });
     }

     return res.status(200).send({
      success : true, 
      message : "List of trips in the way",
      status : "success",
      data : listofTrip
     })



  });
  


// transporter  send reclamation to the admins 
exports.Contactadmin= asyncHandler(async(req, res, next)=>{
  const reclamation = req.body.reclamation;
  const userId = req.user.id;
  const contact = await ContactAdmin.create(
   {
     Client: userId,
     reclamation: reclamation
   }
  );
  if(!contact){
   return res.status(400).send({
     message : "error creating reclaimed message",
     success: false,
     data:[]
   });
  }

  return res.status(200).send({
   message :"Done ! your reclamation has been sent to the admins",
   success: true,
   data:[]
  })

});
exports.getCurrentTransporter=asyncHandler(async(req, res, next)=>{
  return res.status(200).send({
    success: true,
    message: "Current transporter",
    data: req.user
  })
});
exports.getCurrentTrip = asyncHandler(async(req, res, next)=>{
 
    const currentTrip = await tripModel.findOne({
      transporter: req.user.id,
      isDone: false
    }).populate("transporter");
    if(!currentTrip){
      return res.status(404).send({
       
        data: null,
        success : true ,        
        message : "No Trip found for this transporter"
      });
    }

    return res.status(200).send({
      data: currentTrip,
      success : true , 
      message : "found a  trip",
     
    });


});


 // getting all message for  the specific user 
exports.getListofMessage = asyncHandler(async(req, res, next)=>{
  const ListOfMessage = await MessageModel.find({
    transporteur : req.user.id
  }).populate("clientId").populate('transporteur') ;
  if(!ListOfMessage){
    return res.status(404).send({
      message: "error getting message", 
      success: false,
      data:[]
    });
  }
  

  return res.status(200).send({
    message: "Done getting messages", 
    success: true,
    data:ListOfMessage
  });
});
exports.getAllVerifiedDemande= asyncHandler(async(req, res, next)=>{

  const Listdemandes = await verified.find({userId :req.user.id});
    

  if(!Listdemandes){
    return res.status(404).send({
      success: false,
      message : "user has no demande for the moment",
      data:[]
    });
  }

  return res.status(200).send({
    success: true,
    message :"Done Getting the list of demandes",
      data:Listdemandes
  })


});


// change the password of the transporteur 
exports.changepasword = asyncHandler(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword) {
    return res.status(404).send({
      success: false,
      message: "try sending valid  data",
      data: [],
    });
  }

  const user = await transporteur.findById(req.user.id).select("+password");

  if (!user) {
    return res.statud(404).send({
      success: false,
      message: "user not found",
      data: [],
    });
  }

  const isMatched = user.matchPassword(oldpassword);

  if (!isMatched) {
    return res.status(404).send({
      success: false,
      message: "password isn t correct ",
    });
  }

  try {
    user.password = newpassword;
    user.save();
    return res.status(200).send({
      success: true,
      message: "user updated successfully",
    });
  } catch (e) {
    return res.status(200).send({
      success: true,
      message: "ops faild to update password",
    });
  }
});
// change transporteur email address

exports.checkemailBeforechange = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res.status(404).send({
      success: false,
      message: "you must provide us with an email",
      data: [],
    });
  }

  //! searching for a user that  have the same email
  const user = await transporteur.findOne({ email: email });
  //! if there are a user with the same email then return error
  if (user) {
    return res.status(200).send({
      success: false,
      message: "user with the same email exists already",
      data: [],
    });
  }
  //! if there are no users with the same email update the user email

  const userupdated = await transporteur.findByIdAndUpdate(
    req.user.id,
    { email: email },
    { new: true }
  );

  if (!userupdated) {
    return res.status(404).send({
      success: false,
      message: "error updating information",
      data: [],
    });
  }
  return res.status(200).send({
    success: true,
    message: "user updated successfully",
    data: userupdated,
  });
});
