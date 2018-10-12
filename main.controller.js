module.exports = (app) => {
	const EmergencyController = require('./app/controllers/emergency.controller.js');
	const WeatherDBController = require('./app/controllers/weatherDatabase.controller.js');
	const PSIDBController = require('./app/controllers/psiDatabase.controller.js');
	const SMSController = require('./app/controllers/sms.controller.js');
	const EmailController = require('./app/controllers/emailAPI.controller.js');

	const updateInterval = 30 * 60 * 1000;

	// Initializing Databases
	WeatherDBController.initialize();
	PSIDBController.initialize();

	// Setting up routes
	app.get('/', (req, res) => {
		res.json({
			"message": "Hey, welcome to the RakunineCMS application! This isn't the right way to access it btw, read the API for more information."
		});
	});

	app.post('/emergency', EmergencyController.newEmergency);
	app.get('/getEmergencies', EmergencyController.findAll);
	app.get('/getEmergency/:emergencyID', EmergencyController.findOne);
	app.get('/emergencySolved/:emergencyID', EmergencyController.setEmergencyToSolved); //make it put
	app.put('/emergency/:emergencyID', EmergencyController.updateEmergency);
	app.delete('/emergency/:emergencyID', EmergencyController.deleteEmergency);

	app.get('/stationsList', WeatherDBController.getLatestStations);
	app.get('/stationInformation', WeatherDBController.getAllStationInformation);
	app.get('/stationInformation/:stationID', WeatherDBController.getStationInformation);

	app.post('/processSMS', SMSController.processSMSResponse);

	setInterval(function () {
		WeatherDBController.updateDatabase();
		PSIDBController.updateDatabase();
		EmailController.sendEmail("<b> This is where the report would go. </b>");
	}, updateInterval);
}