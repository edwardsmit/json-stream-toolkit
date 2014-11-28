/*jslint node:true*/
'use strict';

var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;

function Interweave(objectToAdd, mapping) {
  if (! (this instanceof Interweave)) {
    return new Interweave(objectToAdd, mapping);
  }
  this._objectToAdd = _.isPlainObject(objectToAdd) ? objectToAdd : {};
  this._mapping = _.isPlainObject(mapping) ? mapping : {};
  Transform.call(this, {objectMode: true});
}
util.inherits(Interweave, Transform);

Interweave.prototype._transform = function (data, encoding, callback) {
  var newObject = _.cloneDeep(this._objectToAdd);
  var mapping = this._mapping;
  if (!_.isEmpty(mapping)) {
    _.each(_.keys(mapping), function(dataProp) {
      var newObjectProp = mapping[dataProp];
      newObject[newObjectProp] = _.isObject(data[dataProp]) ? _.cloneDeep(data[dataProp]): data[dataProp];
    });
    this.push(newObject);
  }
  this.push(data);
  callback();
};

module.exports = Interweave;
