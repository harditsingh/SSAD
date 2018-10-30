module.exports = (app) => {
	const EmergencyController = require('./app/controllers/emergency.controller.js');
	const WeatherDBController = require('./app/controllers/weatherDatabase.controller.js');
	const DengueDBController = require('./app/controllers/dengueDatabase.controller.js');
	const PSIDBController = require('./app/controllers/psiDatabase.controller.js');
	const SMSController = require('./app/controllers/sms.controller.js');
	const EmailController = require('./app/controllers/emailAPI.controller.js');

	const EmailBody = require('./pages/report.js')
	const updateInterval = 30 * 60 * 1000;

	let emergencyStatisticsUpdated = false;
	let psiStatisticsUpdated = false;
	let dengueStatisticsUpdated = false;

	let emailData = {
		"ambulance": 0,
		"fire": 0,
		"terrorist": 0,
		"rescue": 0,
		"gas": 0,
		"psi": 0,
		"dengue": 0
	}

	// Initializing Databases
	WeatherDBController.initialize();
	PSIDBController.initialize();
	DengueDBController.initialize();

	// Setting up routes
	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});

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

	setInterval(function () {
		WeatherDBController.updateDatabase();
		PSIDBController.updateDatabase();
		DengueDBController.updateDatabase();
		collectData();
	}, updateInterval);

	function collectData() {
		EmergencyController.emergencyStatistics(fillEmergencyData);
		PSIDBController.psiStatistics(fillPSIData);
		DengueDBController.dengueStatistics(fillDengueData);
	}

	function fillEmergencyData(input) {
		Object.keys(input).forEach(key => {
			emailData[key] = input[key];
		});
		emergencyStatisticsUpdated = true;
		sendEmail();
	}

	function fillDengueData(input) {
		Object.keys(input).forEach(key => {
			emailData[key] = input[key];
		});
		dengueStatisticsUpdated = true;
		sendEmail();
	}

	function fillPSIData(input) {
		Object.keys(input).forEach(key => {
			emailData[key] = input[key];
		});
		psiStatisticsUpdated = true;
		sendEmail();
	}

	function sendEmail() {
		if (psiStatisticsUpdated && dengueStatisticsUpdated && emergencyStatisticsUpdated) {
			let message = EmailBody.message;

			Object.keys(emailData).forEach(key => {
				message = message.replace("%" + key + "%", emailData[key]);
			});

			EmailController.sendEmail(message);
		}
	}
}