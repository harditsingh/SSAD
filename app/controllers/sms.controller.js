const SMSAPIController = require('../controllers/smsAPI.controller.js');

//Calls SMS API Controller when a SMS response has been received
exports.processSMSResponse = SMSAPIController.processSMSResponse;

//Calls SMS API Controller when new Emergency message has to be sent
exports.sendSMSControler = (messageBody) => {
    SMSAPIController.sendSMS(messageBody);
}