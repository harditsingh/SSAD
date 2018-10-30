const TwilioConfig = require('../../config/twilio.config.js');
const Twilio = require('twilio')(TwilioConfig.accountSid, TwilioConfig.authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const EmergencyController = require('../controllers/emergency.controller.js');

//Receive response message, find and set the specific Emergency case to "Solved"
exports.processSMSResponse = (req, res) => {
    const twiml = new MessagingResponse();
    
    let message = req.body.Body.split(' ');

    //checks if the received message contains "Solved"
    if (message[0] === "Solved") {
        let str = req.body.Body;
        let position = str.search(/Solved\s/i);

        if (position == 0) {
            str = str.substring(str.indexOf(" ") + 1, str.length);
        }

        //calls the Emergency Controller before passing it the Emergency Case to be updated
        EmergencyController.setEmergencyToSolved(str);
        twiml.message("Bravo captain!");
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });

        //sends a response message notifying the emergency case has been updated
        res.end(twiml.toString());
    } else {
        twiml.message(req.body.Body);
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });

        //sends back a response message if it does not contain "Solved"
        res.end(twiml.toString());
    }
}

//Communicates with external SMS API to send out the emergency message
exports.sendSMS = (message) => {
    Twilio.messages
        .create({
            body: message,
            from: TwilioConfig.sender,
            to: TwilioConfig.receiver //The respective government agencies
        })
        .then(message => console.log(message.sid))
        .done();
}