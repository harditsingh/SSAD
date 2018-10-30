var request = require('request');

//api request
exports.getPSIData = (callback) => {
    request('https://api.data.gov.sg/v1/environment/psi', function(error, response, body) {
        //successfully retrieve data from api
        if (!error && response.statusCode == 200) {
            result = JSON.parse(body);          
            return callback(result, false);
        } else { 
            //error retrieving data from api
            return callback(null, error);
        }
    });
}
