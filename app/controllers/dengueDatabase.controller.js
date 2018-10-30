const APIController = require('./dengueAPI.controller.js');
const DengueInformation = require('../models/dengueInformation.model.js');

exports.initialize = () => {
    this.updateDatabase();
}

exports.updateDatabase = () => {
    APIController.getDengueData(function (data, err) {
        if (err) {
            console.log(err);
        } else {
            saveDengueInformation(data);
        }
    });
}

exports.getAllStationInformation = (req, res) => {
    DengueInformation.find()
    .then(dengueData => {
        res.send(dengueData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the dengue data."
        });
    });
}

exports.dengueStatistics = (callback) => {
    let statistics = {
        "dengue": 0
    }

    DengueInformation.find()
        .then(data => {
            statistics["dengue"] = data.length;
            callback(statistics);
        })
};

function saveDengueInformation(dengueData) {
    dengueData.forEach(item => {
        DengueInformation.findOneAndUpdate({
            description: item.Description
        }, {
            $set: {
                description: item.Description,
                lat: item.Lat,
                caseSize: item.CaseSize
            }
        }, {
            upsert: true
        }, function (err, doc) {
            if (err) {
                throw err;
            } 
        });
    });

}