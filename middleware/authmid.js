
const asynchandller = require("../middleware/asynchandller");
const jwt = require("jsonwebtoken");



exports.protect = (model)=> asynchandller(async(req, res, next)=>{
  

  let token ;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token){

    return res.status(403).send({
      success : false  ,
       message : 'You are not allowed to access this',
       data : []
    })
  }
  try {
    const decoded = await jwt.verify(token,"zui87fze69f8z9f7zef74ef" );

    const user = await model.findById(
       decoded.id
    );


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
    console.log(err.message);
    return res.status(500).send({
      success : false ,
      message : err.message,
      data : [],
     })
   }
}
) 