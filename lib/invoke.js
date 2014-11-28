/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;

function Invoke(fn) {
  if (! (this instanceof Invoke)) {
    return new Invoke(fn);
  }
  if (_.isFunction(fn)) {
    this._fn = fn;
  }
  Transform.call(this, {objectMode: true});
}
util.inherits(Invoke, Transform);

Invoke._fn = function (obj) {
  return obj;
};

Invoke.prototype._transform = function (data, encoding, callback) {
  if (this._fn.length === 1) {
    this.push(this._fn(data));
    callback();
  }
  else {
    var self = this;
    this._fn(data, function (err, result) {
      if (err) {
        throw new Error('Invoke error received from function');
      }
      self.push(result);
      callback();
    });
  }
};

module.exports = Invoke;
