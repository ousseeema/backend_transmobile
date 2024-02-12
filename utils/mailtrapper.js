const mailer = require('nodemailer');


const sendemail = async (options)=>{
  
 var transport = mailer.createTransport(
  {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
         user:  "ed6990159e4dcc",
         pass: "86d8b94f6b7505"
            }
      
  }
 );

 const message = {
  form: `WeStudySG@gmail.com`,
  to:options.emailto,
  subject:options.subject,
  text: options.text
 }




 const info = await transport.sendMail(message,(error, info) => {
  if (error) {
    console.error('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
  
});

   




}
module.exports = sendemail;