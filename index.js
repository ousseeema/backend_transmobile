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





// importing automatic delete functions for user and transporteur accounts
const deletePlanifier = require("./utils/deletePlanifie");  
// importing user model and transporteur model
const userModel = require('./model/userModel');
const transportModel = require('./model/transportorModel');
deletePlanifier(userModel);
deletePlanifier(transportModel);



// clients routes 
const clientsRoute = require('./routes/userRoute');
app.use("/api/v0/clients", clientsRoute);

// transporteurs routes
const transporteursRoute = require('./routes/transporteurRoute');
app.use("/api/v0/transporteurs", transporteursRoute);

// auth Routes 
const authRoutes = require("./routes/authRoute");
app.use("/api/v0/auth", authRoutes);

 



// connecting to the database
connectDB();
// port number
const PORT = 3000;
// serveur connecting 
const serveur = app.listen(PORT, () => {
  console.log(`serveur is running on port ${PORT}`.yellow.bold);
});

process.on('unhandledRejection',(err,promise)=>{
  console.log(`error : ${err.message}`.red);
  serveur.close(()=>process.exit(1))
}); 

