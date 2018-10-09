const mongoose = require('mongoose');

const EmergencyForm = mongoose.Schema({
	name: String,
    mobile: Number,
    postcode: String,
    bldgNumber: String,
    emergencyType: String,
    status: String //'Pending' or 'Solved'
}, {
	timestamps: true
});

module.exports = mongoose.model('EmergencyForm', EmergencyForm);
