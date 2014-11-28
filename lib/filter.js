/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;

function Filter(fn) {
  if (! (this instanceof Filter)) {
    return new Filter(fn);
  }
  this._fn = _.isFunction(fn) ? fn : function () {return true;};
  Transform.call(this, {objectMode: true});
}
util.inherits(Filter, Transform);

Filter.prototype._transform = function (data, encoding, callback) {
  if (this._fn(data)) {
    this.push(data);
  }
  callback();
};

module.exports = Filter;
