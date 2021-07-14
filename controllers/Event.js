




'use strict';

var Event = require('../service/EventService');

module.exports.postEvent = function postEvent (req, res, next) {

    Event.postEvent(req.swagger.params, res, next);

};
