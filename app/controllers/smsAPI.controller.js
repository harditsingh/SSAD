const TwilioConfig = require('../../config/twilio.config.js');
const Twilio = require('twilio')(TwilioConfig.accountSid, TwilioConfig.authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const EmergencyController = require('../controllers/emergency.controller.js');


exports.processSMSResponse = (req, res) => {
    const twiml = new MessagingResponse();
    
    let message = req.body.Body.split(' ');
    
    if (message[0] === "Solved") {
        let str = req.body.Body;
        let position = str.search(/Solved\s/i);

        if (position == 0) {
            str = str.substring(str.indexOf(" ") + 1, str.length);
        }

        EmergencyController.setEmergencyToSolved(str);
        twiml.message("Bravo captain!");
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    } else {
        twiml.message(req.body.Body);
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    }
}

exports.sendSMS = (message) => {
    Twilio.messages
        .create({
            body: message,
            from: TwilioConfig.sender,
            to: TwilioConfig.receiver
        })
        .then(message => console.log(message.sid))
        .done();
}