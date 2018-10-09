module.exports = (app) => {
	const EmergencyController = require('../controllers/emergency.controller.js');
	const WeatherDBController = require('../controllers/weatherDatabase.controller.js');

	WeatherDBController.initialize();



	app.get('/', (req, res) => {
		res.json({
			"message": "Hey, welcome to the RakunineCMS application! This isn't the right way to access it btw, read the API for more information."
		});
	});

	app.post('/emergency', EmergencyController.newEmergency);
	app.get('/getEmergencies', EmergencyController.findAll);
	app.get('/getEmergency/:emergencyID', EmergencyController.findOne);
	app.get('/emergencySolved/:emergencyID', EmergencyController.setEmergencyToSolved);
	app.put('/emergency/:emergencyID', EmergencyController.updateEmergency);
	app.delete('/emergency/:emergencyID', EmergencyController.deleteEmergency);

	app.get('/stationsList', WeatherDBController.getLatestStations);
	app.get('/stationInformation/:stationID', WeatherDBController.getStationInformation);

}