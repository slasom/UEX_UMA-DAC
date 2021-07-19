'use strict';
const operators = require('../util/operators');


exports.aggregate =function (result, method){


    switch(method){
        case "getTemperature":
            result=operators.avg(result);
            return result;
        break;
    }


}