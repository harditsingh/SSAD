exports.getDengueData = (callback) => {
    var request = require("request")
    var accessToken;

    //Url for the OneMap api
    var url = "https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?queryName=dengue_cluster&token="


    //OneMap api account
    var formData = {
        email: "gwang011@e.ntu.edu.sg",
        password: "RakuNine"
    };
    
    //retrieve data from OneMap api
    fetchData = (url, accessToken) =>
        request({
            url: url + accessToken,
            json: true
        }, function (error, response, body) {
            //successfully retrieve data from OneMap api
            if (!error && response.statusCode === 200) {
                //initialize array of all dengue cases
                //each entry will include case description, case size and geolocation of the dengue case
                var dengue = [];
                //update data from OneMap api
                for (x = 1; x < body.SrchResults.length; x++) {
                    var cases = {
                        Description: body.SrchResults[x].DESCRIPTION,
                        CaseSize: body.SrchResults[x].CASE_SIZE,
                        Lat: body.SrchResults[x].LatLng
                    }
                    //insert data from OneMap api into array
                    dengue.push(cases);
                }
                callback(dengue, false);
            //error retrieving data from OneMap api
            } else {
                callback(null, error);
            }
        });


    //To get the access token from OneMap api
    request.post({
        url: 'https://developers.onemap.sg/privateapi/auth/post/getToken',
        formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('error', err);
        }
        var JBody = JSON.parse(body);
        accessToken = JBody.access_token;
        var expiry = JBody.expiry_timestamp;
        fetchData(url, accessToken);
    });
}
