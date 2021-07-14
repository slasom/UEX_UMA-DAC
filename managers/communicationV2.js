'use strict';

var vars = require('../index');
var request = require('request');
var dataManager=require('./data');
var fs = require('fs');

const DAC = require('../util/aggregation');
const { json } = require('body-parser');

var mqtt = vars.mqtt;




var idRequest=0;
const reqMap = new Map();


var sender="ShoppingCenterDAC";


var request={
    "resource": "",
    "method": "",
    "idRequest":"",
    "devices":"",
    "sender":"",
    "params": {

        }
  };

  var beginHR
  var beginTransfer

exports.sendRequest = function (body, resource, method, qos ,res){
    var id=idRequest
    idRequest++
    

    request.resource=resource;
    request.method=method;
    request.idRequest=id;
    request.sender=sender;
    request.devices=qos;
    request.params=body;

   // console.log(request)

    dataManager.createRequest(id);
    reqMap.set(id, { res: res, method: method, body: body, sent: false});



    beginHR = process.hrtime()
    beginTransfer = beginHR[0] * 1000000 + beginHR[1] / 1000;

    //TODO: Change if necessary by your configuration
    mqtt.publish("ShoppingCenterMobile", JSON.stringify(request));

    return id;

}


exports.sentTemperature = function(requestId) {

    requestId=parseInt(requestId)

    var obj = reqMap.get(requestId);

    if(obj.sent==false){


        //T Transfer
        var endHR = process.hrtime()
        var endTransfer = endHR[0] * 1000000 + endHR[1] / 1000;
        var duration = (endTransfer - beginTransfer) / 1000;
        var tTransfer = Math.round(duration * 1000) / 1000;

        console.log("T Transfer: "+tTransfer)
        ////////



        reqMap.set(requestId, { res: null, method: null, body: null, sent: true});
        var result = dataManager.getResult(requestId)

        var devices = result.length;
        var size_body=JSON.stringify(result).length;

        result=DAC.avg(result)

        var size_body_aggregatted=JSON.stringify(result).length;

        console.log(result)

        //T AGGREGATION
        var endHRAGG = process.hrtime()
        var endAGG = endHRAGG[0] * 1000000 + endHRAGG[1] / 1000;
        duration = (endAGG - endTransfer) / 1000;
        var tAgg = Math.round(duration * 1000) / 1000;

        console.log("T Aggregation: "+tAgg)
        /////

      


        /////////// LOG /////////////
        
        //DateTime
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        var timestamp = dt.format('Y-m-d,H:M:S');
        console.log("DateTime: "+timestamp);


        ////////////////////////////


        
        if (result != null || result != undefined) {

            //WRITE LOG
            writeFile(requestId, timestamp, tTransfer, tAgg, size_body, size_body_aggregatted, devices) 

            obj.res.contentType('text/plain');
            obj.res.status(200).send(result.toString());
        }else
            obj.res.status(204).send('No Results');
    }

}


exports.getResult = function (id){
    return dataManager.getResult(id);
}


function writeFile(id,timestamp,tTransfer,tAgg, body, bodyAgg, devices) {
    fs.writeFile("LOG.csv", id+","+timestamp+","+tTransfer+","+tAgg+","+body+","+bodyAgg+","+devices+'\n', { flag: "a" }, function(err) {
      if (err) {
        //console.log("file " + filename + " already exists, testing next");
       
      }
      else {
        //console.log("Succesfully written " + filename);
      }
    });
  
  }