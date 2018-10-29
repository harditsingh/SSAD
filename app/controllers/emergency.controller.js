const Emergency = require('../models/emergencyForm.model.js');
const SMSController = require('./sms.controller.js');

exports.newEmergency = (req, res) => {
    //Using Express-Validator to check for errors
    req.checkBody('name').notEmpty().withMessage("Name is required").isAlpha().withMessage("Name should only contain alphabets");
    req.checkBody('mobile').notEmpty().withMessage("Mobile is required").isMobilePhone("en-SG").withMessage("Mobile number should be valid");
    req.checkBody('postcode').notEmpty().withMessage("Postal Code is required").isNumeric().withMessage("Postal Code must be numeric").isLength({ min: 6, max: 6 }).withMessage("Postal Code should be valid");
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

    const emergency = new Emergency({
        name: req.body.name,
        mobile: req.body.mobile,
        postcode: req.body.postcode,
        bldgNumber: req.body.bldgNumber,
        emergencyType: req.body.emergencyType,
        location: req.body.location,
        status: "Pending"
    });

    SMSController.sendSMSControler(
        "Name: " + req.body.name +
        "\nMobile Number: " + req.body.mobile +
        "\nPostcode: " + req.body.postcode +
        "\nBuilding Number: " + req.body.bldgNumber +
        "\nEmergency Type: " + req.body.emergencyType +
        "\nhttps://maps.google.com/?q=" + req.body.location.latitude + "," + req.body.location.longitude
    );

    emergency.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the emergency."
            });
        });
};

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

exports.findOne = (req, res) => {
    Emergency.findById(req.params.emergencyID)
        .then(emergency => {
            if (!emergency) {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyID
                });
            }
            res.send(emergency);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyID
                });
            }
            return res.status(500).send({
                message: "Error retrieving emergency with id " + req.params.emergencyID
            });
        });
};

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
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            res.send(emergency);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            return res.status(500).send({
                message: "Error updating emergency with id " + req.params.emergencyId
            });
        });
};

exports.deleteEmergency = (req, res) => {
    Emergency.findByIdAndRemove(req.params.emergencyID)
        .then(emergency => {
            if (!emergency) {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            res.send({
                message: "Emergency deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Emergency not found with id " + req.params.emergencyId
                });
            }
            return res.status(500).send({
                message: "Could not delete emergency with id " + req.params.emergencyId
            });
        });
};