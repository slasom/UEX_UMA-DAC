'use strict';
var params = require('../util/parameters.js');
var sender = require('../managers/communication.js');



/**
 * Gets the environment temperature
 * Obtain current environment temperature
 *
 **/

var paramsgetTemperature=["devices"];
var timeoutgetTemperature=2500;
var devices = 2
module.exports.getTemperature = function(req, res, next) {

    body={}
    //Parameters
    var body=params.getParams(req,paramsgetTemperature)


    //Only in this case study for ease of testing
    devices=body.devices;
   
    var id=sender.sendRequest(body,"Status","getTemperature", devices, res)

    setTimeout(function(){
        sender.sendResult(id)
    }, timeoutgetTemperature);


};






