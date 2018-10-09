const Emergency = require('../models/emergencyForm.model.js');

exports.test = () => {
    console.log('Works!');
}

exports.newEmergency = (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: "Form content can not be empty"
        });
    }

    const emergency = new Emergency({
        name: req.body.name,
        mobile: req.body.mobile,
        postcode: req.body.postcode,
        bldgNumber: req.body.bldgNumber,
        emergencyType: req.body.emergencyType,
        status: "Pending"
    });

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

exports.setEmergencyToSolved = (req, res) => {
    Emergency.findByIdAndUpdate(req.params.emergencyID, {
        status: "Solved"
    }, {
        new: true
    })
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
            message: "Error updating emergency with id " + req.params.emergencyId
        });
    });
};


exports.updateEmergency = (req, res) => {
    // Validate Request
    if (!req.body.content) {
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
    Emergency.findByIdAndRemove(req.params.emergencyId)
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