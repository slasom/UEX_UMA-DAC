'use strict';

var config = require('./config');




var fs = require('fs'),
http = require('http'),
path = require('path');
var dataManager = require('./managers/data')


//LOG INITIALIZATION

try {
    if (!fs.existsSync('LOG.csv')) {
      
        fs.writeFile("LOG.csv", "ID,timestamp,tTransfer,tAgg,body,bodyAgg,devices"+'\n', { flag: "a" }, function(err) {
            if (err) {
            //console.log("file " + filename + " already exists, testing next");
            
            }
            else {
            //console.log("Succesfully written " + filename);
            }
        });
    }
  } catch(err) {
    console.error(err)
  }


 


var mqttConnection = require('mqtt')



var express = require("express");
var app = express();

app.use(express.json({
    strict: false
}));
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = config.URL_PORT;  



var spec = fs.readFileSync(path.join(__dirname, '/api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
    controllers: path.join(__dirname, './controllers'),
    loglevel: 'info',
    strict: false,
    router: true,
    validator: true
};


const mqtt  = mqttConnection.connect(config.MQTT.PROTOCOL+'://'+config.MQTT.HOST+':'+config.MQTT.PORT,config.MQTT.options);

exports.mqtt=mqtt;

//const service = require('./managers/communicationV2');
var service = require('./managers/communication');

mqtt.on('connect', function () {
    console.log("MQTT Status: Connected!")
})

mqtt.on("error",function(error){ 
    console.log("MQTT Status: Can't connect "+error)});

mqtt.subscribe('ShoppingCenterDAC');

mqtt.on('message', function (topic, message) {
    
    //console.log("Result received from MQTT by topic: " +topic)
    message= message.toString('utf8')
    
    var body=JSON.parse(message);

    var devices=body.devices;

    var length=dataManager.insertData(body)

     if(length==devices){
         console.log("All devices replies")
         service.sendResult(body.idRequest)
    }


});






oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
    http.createServer(app).listen(serverPort, function() {
        console.log("App running at http://localhost:" + serverPort);
        console.log("________________________________________________________________");
        if (options_object.docs !== false) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log("________________________________________________________________");
        }
    });
});