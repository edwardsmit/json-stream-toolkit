/*jslint node:true*/
'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var JsonToJoinLine = require('./util/jsonjoinline.js').JsonToJoinLine;
var JoinLineToJson = require('./util/jsonjoinline.js').JoinLineToJson;
var PassThrough = require('stream').PassThrough;
var spawn = require('child_process').spawn;

var unixSort = require('unix-sort');

function join(leftStream, rightStream, type, leftKey, rightKey) {
  rightKey = rightKey || leftKey;
  var id = null;
  var tmpdir = os.tmpdir();
  do {
    id = Date.now() + Math.random();
  } while(fs.existsSync(path.join(tmpdir, id.toString())));

  var rightFile = path.join(tmpdir, id.toString());

  var rightFileStream = fs.createWriteStream(rightFile);
  rightStream.pipe(unixSort([rightKey])).pipe(new JsonToJoinLine(rightKey)).pipe(rightFileStream);
  var outStream = new PassThrough({objectMode: true});

  rightFileStream.on('finish', function() {
    var joinParams = [];
    switch (type) {
      case 'left':
        joinParams.push('-a1');
        break;
      case 'right':
        joinParams.push('-a2');
        break;
      case 'full':
        joinParams.push('-a1');
        joinParams.push('-a2');
        break;
      default:
        break;
    }
    joinParams.push('-o1.2,2.2');
    joinParams.push('-t\t');
    joinParams.push('-11');
    joinParams.push('-21');
    joinParams.push('-');
    joinParams.push(rightFile);
    var unixJoin = spawn('/usr/bin/join', joinParams, {env: process.env, stdio: 'pipe'});
    unixJoin.stdout.on('end', function() {
      fs.unlink(rightFile);
    });
    unixJoin.stdout.pipe(new JoinLineToJson()).pipe(outStream);
    leftStream.pipe(unixSort([leftKey])).pipe(new JsonToJoinLine(leftKey)).pipe(unixJoin.stdin);
  });
  return outStream;
}

module.exports = join;
