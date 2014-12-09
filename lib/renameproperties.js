/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Invoke = require('./invoke.js');

function RenameProperties(propertiesToRename) {
  if (! (this instanceof RenameProperties)) {
    return new RenameProperties(propertiesToRename);
  }
  this._propertiesToRename = propertiesToRename || {};
  Invoke.call(this);
}
util.inherits(RenameProperties, Invoke);

RenameProperties.prototype._fn = function (data) {
  _.each(this._propertiesToRename, function(to, from) {
    data[to] = data[from];
    delete data[from];
  });
  return data;
};

module.exports = RenameProperties;
