//The below code was modified from a Youtube video, courtesy of Traversy Media
//Modified for our project website

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
//app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

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
    host: 'mail.students.rowan.edu',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        type: "OAuth2",
        user: 'peacoc24@students.rowan.edu', // generated ethereal user
        pass: 'MyPassword'  // generated ethereal password
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
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server is listening on 3000!'));