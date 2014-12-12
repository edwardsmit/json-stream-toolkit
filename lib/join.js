/*jslint node:true*/
'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var JsonToJoinLine = require('./util/jsonjoinline.js').JsonToJoinLine;
var JoinLineToJson = require('./util/jsonjoinline.js').JoinLineToJson;
var PassThrough = require('stream').PassThrough;
var WaitForAll = require('ewait').WaitForAll;
var spawn = require('child_process').spawn;

function join(leftStream, rightStream, type, leftKey, rightKey) {
  function getUniqueTempFile() {
    var id = null;
    var tmpdir = os.tmpdir();
    do {
      id = Date.now() + Math.random();
    } while(fs.existsSync(path.join(tmpdir, id.toString())));
    return path.join(tmpdir, id.toString());
  }

  function sort(stream, key) {
    var sortFile = getUniqueTempFile();
    var sortFileStream = fs.createWriteStream(sortFile);
    stream.pipe(new JsonToJoinLine(key)).pipe(sortFileStream);

    var outStream = new PassThrough({objectMode: false});
    sortFileStream.on('finish', function() {
      var sortParams = [];
      sortParams[0] = '-t\t';
      sortParams[1] = '-k1,1';
      sortParams[2] = sortFile;
      var unixSort = spawn('/usr/bin/sort', sortParams, {env: process.env, stdio: 'pipe'});
      unixSort.stdout.on('end', function() {
        fs.unlink(sortFile);
      });
      unixSort.stdout.pipe(outStream);
    });
    return outStream;
  }

  rightKey = rightKey || leftKey;
  var leftFile = getUniqueTempFile();
  var rightFile = getUniqueTempFile();

  var leftFileStream = fs.createWriteStream(leftFile);

  leftStream = sort(leftStream, leftKey);
  leftStream.pipe(leftFileStream);

  var rightFileStream = fs.createWriteStream(rightFile);

  rightStream = sort(rightStream, rightKey);
  rightStream.pipe(rightFileStream);

  var bothFiles = new WaitForAll({
    event: 'finish'
  });

  bothFiles.add([leftFileStream, rightFileStream]);

  var outStream = new PassThrough({objectMode: true});

  bothFiles.on('done', function() {
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
    joinParams.push(leftFile);
    joinParams.push(rightFile);
    var unixJoin = spawn('/usr/bin/join', joinParams, {env: process.env, stdio: 'pipe'});
    unixJoin.stdout.on('end', function() {
      fs.unlink(leftFile);
      fs.unlink(rightFile);
    });
    unixJoin.stdout.pipe(new JoinLineToJson()).pipe(outStream);
  });
  bothFiles.wait();
  return outStream;
}

module.exports = join;
