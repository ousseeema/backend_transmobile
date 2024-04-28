const mongoose =  require('mongoose');

const ContactAdmin= mongoose.Schema({

Client : {
  type : mongoose.Schema.Types.ObjectId,
  ref: "user",
  required : [true, "user required "],

},
reclamation : {
  type : String,
  required : [true, "reclamation required"],
},
CreatedAt : {
  type: Date,
  default: Date.now(),
}

});


module.exports = mongoose.model('contactus', ContactAdmin);