const nodemailer = require('nodemailer')


const sendEmailNotification = (to, subject, html)=>{

    var response;
    var transport = nodemailer.createTransport({
      host: "mail.homeclassgroup.com",
      port: 465,
      secure: true,
      auth: {
        user: "noreply@homeclassgroup.com",
        pass: "Homeclass2021@@",
      },
        tls: {
            rejectUnauthorized: false
        }
      });

      var mailOptions = {
        from: "noreply@homeclassgroup.com",
        to: to,
        subject: subject,
        html: html
      };
      
      
      transport.sendMail(mailOptions, function(error, info){
        if (error) {
        
            response = error
        } else {
            response = info
            
            
        }
      });
    
      return response
}


module.exports = {sendEmailNotification}