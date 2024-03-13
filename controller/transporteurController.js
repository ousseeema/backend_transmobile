const asyncHandler = require('../middleware/asynchandller');
const transporteur = require('../model/transportorModel');
const fs = require("fs");
const tripModel =require('../model/tripModel');
const demandeDelv = require('../model/demandeDelv');
const path = require("path");
const historymodel = require("../model/historyTrip");

// updating user data name email

exports.updateUserDetails= asyncHandler(async(req, res , next) => {
    if(!req.body){
      return res.status(404).send({
        message : "please enter your info",
        success : false,
        data:[]
      })
    }
   
   if(req.body.password){
    return res.status(400).send({
      success : false ,
      message : "You can't update password from here",
      data : []
    });
   }
  
 


  
  const transporter = await transporteur.findByIdAndUpdate(req.user.id,
    req.body,
    {
      runvalidate : true , 

      new : true});

  if(!transporter){

    return res.status(404).send({
      success : false ,
      message : "transporteur not found",
      data : []
    });


  }
  return res.status(200).send({
    success : true ,
    message : "transporteur information updated successfully",
    data : transporter
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
    const trip= await tripModel(req.body);
    trip.save({
      runvalidate : true,
    });

  
  if(!trip){
    return res.status(203).send({
      status : "fail",
      success : false ,
      message : 'You cannot add trip twice',
    })

  }
  
   
 return res.status(200).send({
    success : true , 
    status: "success", 
    message : "You have posted a trip successfuly"
  });


});



// get all demandes for the transporter 
exports.getAlldemande = asyncHandler(async(req, res, next) => {

 const alldemandes = await demandeDelv.find(
  {transporter : req.user.id}

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

   // ! calculating the amount and adding it to the transporter revenu 
   const amount = demandeaccepte.numberofkg * req.user.price_kg;




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
 const addPackageTo_theTrip = await tripModel.findByIdAndUpdate(req.params.id,{
  $push : {packages : demandeaccepte},
  $inc : {numberofpackage :1}
 });



 if(!addPackageTo_theTrip){
  return res.status(400).send({
    message : "error seatching for trip",
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



// update trip
exports.updateTrip = asyncHandler(async(req, res, next) => {
  
  const updatedTrip = await tripModel.findByIdAndUpdate(req.params.id, 
    req.body,
    { 
      runvalidate : true,
      new :true
  
    });
    if(!updatedTrip){
      return res.status(404).send({
        message : "error while updating the trip",
        success : false,
        status : "fail",
        data :[]
      });
    }


    return res.status(200).send({
      message : "trip updated successfuly",
      success : true,
      status : "success",
      data : updatedTrip
    });


});


// delete the current trip 
exports.deleteTrip = asyncHandler(async(req, res, next)=>{
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
      req.body.packageohoto = "default.png";
  const package = await tripModel.findByIdAndUpdate(req.params.id,{
    $push : {packages : req.body},
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
    const amount =  req.user.price_kg * req.body.numberofkg;
    const transporterupdate = await transporteur.findByIdAndUpdate(req.user.id,
      {
        $inc :{numberofPackages : 1, numberofClients : 1, totalRevenue: amount}

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


   const deletetrip = await tripModel.findByIdAndDelete(req.params.id);
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
     });
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



  })

 