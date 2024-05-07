//* importing express 
const express = require('express');
const app = express();


//* importing  environment variables 
const dotenv = require('dotenv');
//* the path of  environment variables
dotenv.config({ path: "./config/config.env" });
//* importing colors to decorate output console
const colors = require('colors');
//* importing path
const path = require('path');
//* importing connectdb functions 
const connectDB = require("./config/database");

// everything passes through the middleware BECOME in json format 
app.use(express.json());
//  importing socket io 




const uploadfile = require("express-fileupload")
app.use(uploadfile());

// importing automatic delete functions for user and transporteur accounts
const deletePlanifier = require("./utils/deletePlanifie");  
// importing user model and transporteur model
const userModel = require('./model/userModel');
const transportModel = require('./model/transportorModel');
//deletePlanifier(userModel);
//deletePlanifier(transportModel);



// clients routes 
const clientsRoute = require('./routes/users/userRoute');
app.use("/api/v0/clients", clientsRoute);

// transporteurs routes
const transporteursRoute = require('./routes/users/transporteurRoute');
app.use("/api/v0/transporteurs", transporteursRoute);




// auth Client Routes 
const authClientRoutes = require("./routes/auth/authClientsRoute");
app.use("/api/v0/authClient", authClientRoutes);
// auth Transporteur Routes
const authTransporteurRoutes = require("./routes/auth/authTransporteurRoutes");
app.use("/api/v0/authTransporteur", authTransporteurRoutes);

// accessing photo from out side the application
app.use("/Images/", express.static(path.join(__dirname,"Images"))) 





 // error middleware import and use 
 const errorMiddleware= require('./middleware/errormid');
app.use(errorMiddleware);


// connecting to the database
connectDB();
// port number
const PORT = 3000;

const ipAddress = '192.168.100.20';
// serveur connecting 
 const server =app.listen(PORT, ipAddress,() => {
  console.log(`Server running on port ${PORT}`);
});

const io = require('socket.io')(server);


const MessageModel=require('./model/messageModel');


// connecting to the socket server

io.on('connection',(socket)=>{
  console.log('Connected', socket.id.magenta);
  socket.on('disconnect',()=>{
    console.log('Disconnected',socket.id.bgMagenta);
  });

  socket.on('sendMessage',async (message)=>{
   console.log(message);




   const existedDiscussion = await MessageModel.find({
    transporteur: message["transporteur"],
    clientId: message['user']
  }); 

  if(existedDiscussion==false){
    // if user has not contacted the transporteur anytime
    //!create new discussion and send the message to the transporteur 
      const newDiscussion = await MessageModel.create({
        clientId :  message['user'],
        transporteur : message["transporteur"], 
        $push:{
          messages: {
            user:  message['user'],
            message: message,
            CreatedAt: Date.now(),
          },
        }
        
      });

      await newPost.populate('transporteur').execPopulate();
      console.log(newDiscussion);
      socket.broadcast.emit("message-recived",newDiscussion);






  }
  else{
    const OldDiscussion = await MessageModel.findOneAndUpdate({
      transporteur: message["transporteur"],
      Client: message['user']
    },  {
      $push: {
        messages: {
          user:message['user'] ,
          message: message,
          CreatedAt: Date.now(),
        },
      },
    },
    { new: true }).populate('transporteur'); 
    console.log(OldDiscussion);
    socket.broadcast.emit("message-recived",OldDiscussion);



    
  }





   

  });

})










process.on('unhandledRejection',(err,promise)=>{
  console.log(`error : ${err.message}`.red);
  server.close(()=>process.exit(1))
}); 

