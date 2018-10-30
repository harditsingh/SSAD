var request = require('request');

//api request to get temperature value
exports.getTemperature = function (callback){
    request('https://api.data.gov.sg/v1/environment/air-temperature', function(error, response, body) {
        //successfully retrieve temperature from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving temperature from api
        } else {            
            return callback(null, error);
        }
    });
}

//api request to get humidity value
exports.getHumidity = function (callback){
    request('https://api.data.gov.sg/v1/environment/relative-humidity', function(error, response, body) {
        //successfully retrieve humidity from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving humidity from api
        } else {            
            return callback(null, error);
        }
    });
}

//api request to get rainfall amount
exports.getRainfall = function (callback){
    request('https://api.data.gov.sg/v1/environment/rainfall', function(error, response, body) {
        //successfuly retrieve rainfall from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving rainfall from api
        } else {            
            return callback(null, error);
        }
    });
}

//api request to get wind direction
exports.getWindDirection = function (callback){
    request('https://api.data.gov.sg/v1/environment/wind-direction', function(error, response, body) {
        //successfully retrieve wind direction from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving wind direction from api
        } else {            
            return callback(null, error);
        }
    });
}

//api request to get wind speed
exports.getWindSpeed = function (callback){
    request('https://api.data.gov.sg/v1/environment/wind-speed', function(error, response, body) {
        //successfully retrieve wind speed from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving wind speed from api
        } else {            
            return callback(null, error);
        }
    });
}

//api request to get psi value
exports.getPSIData = (callback) => {
    request('https://api.data.gov.sg/v1/environment/psi', function(error, response, body) {
        //successfully retrieve psi value from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        //error retrieving psi value from api
        } else {            
            return callback(null, error);
        }
    });
}
