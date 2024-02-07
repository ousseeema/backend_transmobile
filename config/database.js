const mongosse = require('mongoose');

 const connectDb = async ()=>{

  try {
    console.log('Connecting ... ');
    const connect = await mongosse.connect(process.env.mongo_uri);
    console.log("Connected to data base ".cyan.underline.bold )
    
  } catch (err) {
    console.log(`error : ${err.message}`.red);
    
  }

}
module.exports = connectDb;