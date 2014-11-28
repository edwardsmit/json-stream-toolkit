/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;

function Cap(options) {
  if (! (this instanceof Cap)) {
    return new Cap(options);
  }
  this._cap = _.isNumber(options) ? options : 0;
  Transform.call(this, {objectMode: true});
}
util.inherits(Cap, Transform);

Cap.prototype._transform = function (data, encoding, callback) {
  if (this._cap >= 0) {
    if (this._cap === 0) {
      data = null;
    }
    this._cap--;
    this.push(data);
  }
  callback();
};

module.exports = Cap;
