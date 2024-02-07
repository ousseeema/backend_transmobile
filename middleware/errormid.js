const errorhandler = (err,req, res, next) => {
  console.log(err.message);
  console.log(err);
  if (err.name === "CastError") {
    res.send({ message: ` resource not found ` });
  }
  else if (err.code === 11000) {
    res.send({ message: "Duplicate key entered" });
  }
  else if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
      res.status(400).send({success: false, message:messages})
  }
  else if(err.name==="SyntaxError"){
    res.status(400).send({
      success : false,
      message: "error syntax in the body"
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