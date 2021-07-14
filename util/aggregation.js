'use strict';


exports.sum = function (result){
    var finalResult;
    
    result.forEach(element => {
        finalResult=+element
    });
    
    return finalResult;
}

exports.avg = function (json){

    
    var finalResult=0;
    
    
    json.forEach(element => {
        finalResult=finalResult+element
    });

    finalResult=finalResult/json.length
    finalResult=finalResult.toFixed(2)

    return finalResult

    
}

exports.max = function (json){

    
}

exports.min = function (json){

    
}