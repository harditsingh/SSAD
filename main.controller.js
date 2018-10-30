module.exports = (app) => {
	const EmergencyController = require('./app/controllers/emergency.controller.js');
	const WeatherDBController = require('./app/controllers/weatherDatabase.controller.js');
	const DengueDBController = require('./app/controllers/dengueDatabase.controller.js');
	const PSIDBController = require('./app/controllers/psiDatabase.controller.js');
	const SMSController = require('./app/controllers/sms.controller.js');
    const EmailController = require('./app/controllers/emailAPI.controller.js');
    const updateInterval = 30 * 60 * 1000;

	// Initializing Databases
	WeatherDBController.initialize();
	PSIDBController.initialize();
	DengueDBController.initialize();

	// Setting up routes
	// app.get('/', function(req, res) {
	// 	res.sendFile(__dirname + '/public/index.html');
	// });


    //all the available http routes
	app.post('/emergency', EmergencyController.newEmergency);
	app.get('/getEmergencies', EmergencyController.findAll);
	app.get('/getEmergency/:emergencyID', EmergencyController.findOne);
	app.put('/emergency/:emergencyID', EmergencyController.updateEmergency);
	app.delete('/emergency/:emergencyID', EmergencyController.deleteEmergency);

	app.get('/weatherStationsList', WeatherDBController.getLatestStations);
	app.get('/weatherStationInformation', WeatherDBController.getAllStationInformation);
	app.get('/weatherStationInformation/:stationID', WeatherDBController.getStationInformation);

	app.get('/PSIStationsList', PSIDBController.getLatestStations);
	app.get('/PSIStationInformation', PSIDBController.getAllStationInformation);

	app.get('/DengueInformation', DengueDBController.getAllStationInformation);

	app.post('/processSMS', SMSController.processSMSResponse);

    //Every 30 minutes call the controllers to update their data and to send out report through email
	setInterval(function () {
		WeatherDBController.updateDatabase();
		PSIDBController.updateDatabase();
		DengueDBController.updateDatabase();
		EmailController.sendEmail("<b> This is where the report would go. </b>");
	}, updateInterval);
}
