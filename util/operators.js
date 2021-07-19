'use strict';


exports.sum = function (result){
    var finalResult=0;
    
    result.forEach(element => {
        finalResult=+element
    });

    //Formated in JSON
    //finalResult={"sum" : finalResult}
    
    return finalResult;
}

exports.avg = function (result){
    var finalResult=0;
    
    
    result.forEach(element => {
        finalResult=finalResult+element
    });

    finalResult=finalResult/result.length
    finalResult=finalResult.toFixed(2)

    //Formated in JSON
    finalResult={"avg" : finalResult}
    
    return finalResult

    
}

exports.max = function (json){
 //TODO
    //Formated in JSON
    //finalResult={"max" : finalResult}
}

exports.min = function (json){
    //TODO
    
    //Formated in JSON
    //finalResult={"min" : finalResult}
}