const asyncHandler = require('../middleware/asynchandller');
const userModel = require('../model/userModel');



exports.updateUserDetails= asyncHandler(async(req, res , next) => {
 
  
  if (!req.body){
    return res.status(400).send({
      success : false ,
      message : "Please enter the data you want to update",
      data : []
    });
  }

  const user = await userModel.findByIdAndUpdate(req.body);

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