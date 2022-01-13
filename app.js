const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const client = require('@mailchimp/mailchimp_marketing');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

client.setConfig({
  apiKey: '02ca3cef8ffdb0236c9bf07a247c97e6-us20',
  server: 'us20',
});

app.post('/', (reg, res) => {
  const firstName = reg.body.fName;
  const lastName = reg.body.lName;
  const email = reg.body.email;
  console.log(firstName, lastName, email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    try {
      const response = await client.lists.addListMember('dd9875bd4c', {
        email_address: subscribingUser.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(response); // (optional)
      res.sendFile(__dirname + '/success.html');
    } catch (err) {
      console.log('====== ERROR ======');
      console.log(JSON.parse(err.response.error.text).detail);

      res.sendFile(__dirname + '/failure.html');
    }
  };

  run();
});

app.post('/failure.html', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server is runnning on port 3000');
});

// 02ca3cef8ffdb0236c9bf07a247c97e6-us20 api key
// list id dd9875bd4c
