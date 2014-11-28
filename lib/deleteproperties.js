/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Invoke = require('./invoke.js');

function DeleteProperties(propertiesToDelete) {
  if (! (this instanceof DeleteProperties)) {
    return new DeleteProperties(propertiesToDelete);
  }
  this._propertiesToDelete = _.isArray(propertiesToDelete) ? propertiesToDelete : [propertiesToDelete];
  Invoke.call(this);
}
util.inherits(DeleteProperties, Invoke);

DeleteProperties.prototype._fn = function (data) {
  _.each(this._propertiesToDelete, function(value) {
    delete data[value];
  });
  return data;
};

module.exports = DeleteProperties;
