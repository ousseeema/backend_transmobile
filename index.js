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

