'use strict';
var params = require('../util/parameters.js');
var sender = require('../managers/communication.js');
var body;


/**
 * Gets the environment temperature
 * Obtain current environment temperature
 *
 **/

var paramsgetTemperature=["devices"];
var timeoutgetTemperature=2500;
var devicesgetTemperature = 2
module.exports.getTemperature = function(req, res, next) {

    body={}
    //Parameters
    body=params.getParams(req,paramsgetTemperature)


    //Only in this case study for ease of testing
    devicesgetTemperature=body.devices;
   
    var id=sender.sendRequest(body,"Status","getTemperature", devicesgetTemperature, res)

    setTimeout(function(){
        sender.sendResult(id)
    }, timeoutgetTemperature);


};






