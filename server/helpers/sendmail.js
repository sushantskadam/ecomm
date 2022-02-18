const nodemailer = require("nodemailer");
const cred = require('./cred')

module.exports=function sendmail(otp,remail){
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: cred.email,
        pass: cred.pass
    }
});
      let mailDetails = {
    from: cred.email,
    to: `${remail}`,
    subject: 'OTP for NeoSTORE',
    text: `YOUR OTP IS ${otp}`,
    // attachments: [ {   // filename and content type is derived from path
    //         path: path
    //     },]
   
};
mailTransporter.sendMail(mailDetails, function(err, data) {
  if(err) {
      console.log(err);
  } else {
      console.log('Email sent successfully');
  }
});
}