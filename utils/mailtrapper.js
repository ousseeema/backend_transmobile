const mailer = require('nodemailer');


const sendemail = async (options)=>(req, res, next)=>{
  
 var transport = mailer.createTransport(
  {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
         user: process.env.maileruser,
         pass: process.env.mailerpass
            }
      
  }
 );

 const message = {
  form: `WeStudySG@gmail.com`,
  to : options.emailto,
  subject: options.subject,
  text : options.text
 }



 const info = transport.sendMail(message);

   




}
module.exports = sendemail;