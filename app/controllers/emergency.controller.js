const Emergency = require('../models/emergencyForm.model.js');
const SMSController = require('./sms.controller.js');

exports.newEmergency = (req, res) => {
    //Using Express-Validator to check for errors
    req.checkBody('name').notEmpty().withMessage("Name is required");
    req.checkBody('mobile').notEmpty().withMessage("Mobile is required").isMobilePhone("en-SG").withMessage("Mobile number should be valid");
    req.checkBody('postcode').notEmpty().withMessage("Postal Code is required").isNumeric().withMessage("Postal Code must be numeric").isLength({
        min: 6,
        max: 6
    }).withMessage("Postal Code should be valid");
    req.checkBody('bldgNumber').notEmpty().withMessage("Building Number is required").isString();
    req.checkBody('emergencyType').notEmpty().withMessage("Emergency Type is required");
    req.checkBody('location').notEmpty().withMessage("Location is required");

    var errors = req.validationErrors();

    //Returns error messages
    if (errors) {
        var errMsg = "";
        for (x in errors) {
            errMsg = errMsg.concat('\n-').concat(errors[x].msg);
        }
        return res.status(400).send(
            'Error 400: Invalid Input' + errMsg
        );
    }

    //Creates new Emergency object if it passes validation
    const emergency = new Emergency({
        name: req.body.name,
        mobile: req.body.mobile,
        postcode: req.body.postcode,
        bldgNumber: req.body.bldgNumber,
        emergencyType: req.body.emergencyType,
        location: req.body.location,
        status: "Pending"
    });

    //Creates a new SMS message before calling SMS Controller to send it out
    SMSController.sendSMSControler(
        "Name: " + req.body.name +
        "\nMobile Number: " + req.body.mobile +
        "\nPostcode: " + req.body.postcode +
        "\nBuilding Number: " + req.body.bldgNumber +
        "\nEmergency Type: " + req.body.emergencyType +
        "\nhttps://maps.google.com/?q=" + req.body.location.latitude + "," + req.body.location.longitude
    );

    //save the newly created Emergency case into the database
    emergency.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            //if an error occurs when inserting data
            res.status(500).send({
                message: err.message || "Some error occurred while creating the emergency."
            });
        });
};

//retrives from database all the emergency cases and return it
exports.findAll = (req, res) => {
    Emergency.find()
        .then(emergencyList => {
            res.send(emergencyList);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the emergencies."
            });
        });
};

//finds a specific emergency case from database before returning it
exports.findOne = (req, res) => {
    Emergency.findById(req.params.emergencyID)
        .then(emergency => {
            //if specific emergency is not found, return with error message
            if (!emergency) {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyID
                });
            }
            //return the requested emergency case
            res.send(emergency);
        }).catch(err => {
            //if specific emergency is not found, return with error message
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyID
                });
            }
            //server error when retrieving data
            return res.status(500).send({
                message: "Error retrieving emergency with id " + req.params.emergencyID
            });
        });
};

//Receives the name of the emergency to be updated to status "Solved"
exports.setEmergencyToSolved = (receivedName) => {
    Emergency.findOneAndUpdate({
        name: receivedName
    }, {
        $set: {
            status: "Solved"
        }
    }, {
        upsert: true
    }, function (err, doc) {
        if (err) {
            throw err;
        }
    })
};


exports.updateEmergency = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Emergency content can not be empty"
        });
    }

    // Find emergency and update it with the request body
    Emergency.findByIdAndUpdate(req.params.emergencyID, {
            name: req.body.name,
            mobile: req.body.mobile,
            postcode: req.body.postcode,
            bldgNumber: req.body.bldgNumber,
            emergencyType: req.body.emergencyType,
            location: req.body.location,
            status: req.body.status
        }, {
            new: true
        })
        .then(emergency => {
            if (!emergency) {
                //return error message if not found
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            //return updated data
            res.send(emergency);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                //return error message
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            //server error, return error message
            return res.status(500).send({
                message: "Error updating emergency with id " + req.params.emergencyId
            });
        });
};

//Finds the specific Emergency from the database and deletes it
exports.deleteEmergency = (req, res) => {
    //looks throw the database with the requested ID
    Emergency.findByIdAndRemove(req.params.emergencyID)
        .then(emergency => {
            if (!emergency) {
                //returns error if not found
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            //returns success message
            res.send({
                message: "Emergency deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                //returns error message
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            //server side error, return error message
            return res.status(500).send({
                message: "Could not delete emergency with id " + req.params.emergencyId
            });
        });
};

exports.emergencyStatistics = (callback) => {
    let statistics = {
        "ambulance": 0,
        "fire": 0,
        "terrorist": 0,
        "rescue": 0,
        "gas": 0,
    }

    Emergency.find()
        .then(emergencyList => {
            emergencyList.forEach(emergency => {
                let type = emergency.emergencyType
                if (statistics[type] != undefined) {
                    statistics[type] += 1;
                }
            });
            callback(statistics);
        })
};