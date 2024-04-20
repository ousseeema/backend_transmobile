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
const serveur = app.listen(PORT,ipAddress, () => {
  console.log(`serveur is running on port ${ipAddress} ${PORT}`.yellow.bold);
});












process.on('unhandledRejection',(err,promise)=>{
  console.log(`error : ${err.message}`.red);
  serveur.close(()=>process.exit(1))
}); 

