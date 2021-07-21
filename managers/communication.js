'use strict';

var vars = require('../index');
var dataManager=require('./data');
var DAC = require('../DAC/DAC');
var config = require('../config');

var mqtt = vars.mqtt;



//Write file
var fs = require('fs');
var filename = "test.csv";


var result;
var idRequest=0;
var reqMap = new Map();


var request={
    "resource": "",
    "method": "",
    "sender":"",
    "idRequest": 0,
    "params": {

        }
  };


///Log vars
var beginHR
var beginTransfer
var beginAgg

exports.sendRequest =function (body, resource, method, devices, res){
    var id=idRequest
    idRequest++

   

    //TODO: Change if necessary by your configuration
    request.resource=resource;
    request.method=method;
    request.idRequest=id;
    request.sender=config.topicSender;
    request.devices=devices;
    request.params=body;

    dataManager.createRequest(id);
    reqMap.set(id, { res: res, method: method, body: body, sent: false});


    mqtt.publish(config.topicReceivers, JSON.stringify(request));

    beginHR = process.hrtime()
    beginTransfer = beginHR[0] * 1000000 + beginHR[1] / 1000;

    //checkResult(id, timeout)
    return id;
    
}


// function checkResult(id, timeout){
   
//     var res;
//     var obj;

       
//     console.log("Timeout Value: "+timeout)
//     setTimeout(function(){
//         obj = reqMap.get(id);

//         if(obj.sent==false){
//             reqMap.set(id, { res: null, method: null, body: null, sent: true});
//             res=obj.res;
            

           
//             res.contentType('text/plain');
//             res.status(204).end();               
//         }

//     }, timeout);
          

// }

exports.sendResult = function (id){

        id= parseInt(id)
        var obj = reqMap.get(id);
       

        if(obj.sent==false){
            
            //T Transfer
            var endHR = process.hrtime()
            var endTransfer = endHR[0] * 1000000 + endHR[1] / 1000;
            var duration = (endTransfer - beginTransfer) / 1000;
            var tTransfer = Math.round(duration * 1000) / 1000;

            //TIMESTAMP
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var timestamp = dt.format('Y-m-d,H:M:S');






            var res = obj.res;
            var method= obj.method;
            reqMap.set(id, { res: null, method: null, body: null, sent: true});
            result=dataManager.getResult(id)     
            var devices = result.length;

            if(result.length>0){    
            
                var size_body=JSON.stringify(result).length;

                //START AGGREGATION
                beginHR = process.hrtime()
                beginAgg = beginHR[0] * 1000000 + beginHR[1] / 1000;

                result=DAC.aggregate(result,method)


                var size_body_aggregatted=JSON.stringify(result).length;
                
                console.log(result)

                //END AGGREGATION
                var endHRAGG = process.hrtime()
                var endAGG = endHRAGG[0] * 1000000 + endHRAGG[1] / 1000;
                duration = (endAGG - beginAgg) / 1000;
                var tAgg = Math.round(duration * 1000) / 1000;

                console.log("T Aggregation: "+tAgg)

                //WRITE LOG
                 writeFile(id, timestamp, tTransfer, tAgg, size_body, size_body_aggregatted, devices) 

                res.contentType('application/json');
                res.status(200).send(result);
            }else{
                
                //WRITE LOG
                writeFile(id, timestamp, tTransfer, tAgg, 0, 0, devices) 

               obj.res.status(204).end();
           }
                
        }
    
    }




//Only in this case study for ease of testing
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