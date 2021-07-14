'use strict';
const params = require('../util/parameters.js');

const sender = require('../managers/communicationV2.js');



/**
 * Gets the environment temperature
 * Obtain current environment temperature
 *
 **/

var paramsgetTemperature=["devices"];
var timeoutgetTemperature=3200;
var devices = 2
module.exports.getTemperature = function(req, res, next) {
    //Parameters
    var parameters=params.getParams(req,paramsgetTemperature)
    devices=parameters.devices
  
    var body={}
    var id=sender.sendRequest(body,"Status","getTemperature", devices, res)

    setTimeout(function(){
        sender.sentTemperature(id)
    }, timeoutgetTemperature);


};






