/*jslint node:true*/
'use strict';

var _ = require('lodash');
var Transform = require('stream').Transform;
var util = require('util');

function JsonToJoinLine(column) {
  if (! (this instanceof JsonToJoinLine)) {
    return new JsonToJoinLine(column);
  }
  this._column = column;
  Transform.call(this, {objectMode: true});
}
util.inherits(JsonToJoinLine, Transform);

JsonToJoinLine.prototype._transform = function (data, encoding, callback) {
  var line = data[this._column] + '\t' + JSON.stringify(data) + '\n';
  this.push(line);
  callback();
};

function JoinLineToJson() {
  if (! (this instanceof JoinLineToJson)) {
    return new JoinLineToJson();
  }
  Transform.call(this, {objectMode: true});
  this._remainder = '';
}
util.inherits(JoinLineToJson, Transform);

JoinLineToJson.prototype._transform = function (data, encoding, callback) {
  var self = this;
  data = self._remainder + data;
  var lines = data.split('\n');
  if (lines.length === 1) {
    self._remainder = data;
    callback();
  }
  self._remainder = lines.pop();
  _.each(lines, function (line) {
    var pair = line.split('\t');
    pair = _.mapValues(pair, function (objString) {
      return objString.length ? objString: '{}';
    });
    self.push(_.merge(JSON.parse(pair[0]), JSON.parse(pair[1])));
  });
  callback();
};

JoinLineToJson.prototype._flush = function (flushCompleted) {
  var self = this;
  if (self._remainder) {
    var lines = self._remainder.split('\n');
    _.each(lines, function (line) {
      if (line.length) {
        self.push(JSON.parse(line.split('\t')[1]));
      }
    });
  }
  flushCompleted();
};

module.exports.JsonToJoinLine = JsonToJoinLine;
module.exports.JoinLineToJson = JoinLineToJson;
