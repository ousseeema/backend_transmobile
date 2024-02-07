const usermodel = require('../model/userModel');
const asynchandller = require("../middleware/asynchandller");
const jwt = require("jsonwebtoken");




const protect = asynchandller(async(req, res, next)=>{
  

  let token ;

  if(req.authorization && req.authorization.startsWith('Bearer')){
    token = req.authorization.split(' ')[1];
  }

  if(!token){

    return res.status(403).send({
      success : false  ,
       message : 'You are not authorized',
       data : []
    })
  }



  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usermodel.findOne({
      id: decoded.id
    });


    if(!user){
      return res.status(404).send({
        success : false ,
        message : "User not found",
        data : [],
      })
    }


    req.user = user ;
    next();


    
  } catch (err) {
    return res.status(500).send({
      success : false ,
      message : "Error in the server",
      data : [],
  }











}) 