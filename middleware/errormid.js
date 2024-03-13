const errorhandler = (err,req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).send({ message: ` resource not found ` });
  }
  else if (err.code === 11000) {
    res.status(400).send({ message: "User already existe with this email address" });
  }
  else if (err.name === "ValidationError") {
    
    
      res.status(400).send({success: false, message:"check your input fields , there is missing field"})
  }
  else if(err.name==="SyntaxError"){
    res.status(400).send({
      success : false,
      message: " syntax error in the data you submitted"
    });
    
  }
 
  else if(err.name==="TokenExpiredError"){
    res.status(400).send({
      success : false,
      message: "token expired"
    })
  }
  else if(err.name==="TypeError"){
    res.status(400).send({
      success : false,
      message: "input error"
    })
  }
  else if(err.name==="Error"){
    res.status(400).send({
      success : false,
      message: "error"
    })
  }
  else{
    res.status(400).send({
      success : false ,
      message: "error"
    })
  }
  
};

module.exports = errorhandler;