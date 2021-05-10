/* eslint-disable camelcase */
const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const logSchema = new Schema({
	method: {type: String, required: true},
	url: {type: String, required: true},
	status: {type: String, required: true},
	remote_address: {type: String, required: true},
	response_time: {type: String, required: true},
	agent: {type: String, required: true},
	body: {type: Object, required: false},
	response_body: {type: Object, default: {}, required: true},
});

module.exports = mongoose.model('Log', logSchema, 'log');