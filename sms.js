const accountSid = 'AC7c065317bdbf2667e7b8b9a188c3ebb0';
const authToken = '8b751a31d1824e014fc0c9c2b691a0ea';
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({
        body: 'Hello there!',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+31641821330'
      })
      .then(message => console.log(message.sid))
      .done();