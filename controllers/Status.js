




'use strict';

var Status = require('../service/StatusService');

module.exports.getBodyTemperature = function getBodyTemperature (req, res, next) {

    Status.getBodyTemperature(req.swagger.params, res, next);

};

module.exports.getTemperature = function getTemperature (req, res, next) {

    Status.getTemperature(req.swagger.params, res, next);

};

module.exports.getUser = function getUser (req, res, next) {

    Status.getUser(req.swagger.params, res, next);

};
