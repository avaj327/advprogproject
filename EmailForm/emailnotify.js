//The below NodeMailer code was modified from a Youtube video, courtesy of Traversy Media
//DEC 04 2020
//GIT NodeContactForm (Version 1.0.0), source code
//https://github.com/bradtraversy/nodecontactform

//Google Authentication code, credit from:
//Medium Article, written by Nick Roach
//DEC 09 2020
//https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express();

const oauth2Client = new OAuth2(
  "Your ClientID Here", // client id 
  "Your Client Secret Here", // client secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
  refresh_token: "Your Refresh Token Here"
});
const accessToken = oauth2Client.getAccessToken()

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('contact',{layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        type: "OAuth2",
        user: 'peacoc24@students.rowan.edu', // generated ethereal user
        clientId: 'client id',
        clientSecret: 'MySecret',
        refreshToken: 'token here',
        accessToken: accessToken
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"New Jersey County" <peacoc24@students.rowan.edu>', // senders email
      to: 'USER', // selected user
      subject: 'Covid-19 Stats Request',
      text: 'Here are the Covid stats for the county you selected', // pull from selected county
      html: output // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server is listening on 3000!'));