describe('json-stream-toolkit', function() {
  'use strict';
  var chai = require('chai');
  var expect = chai.expect;

  var jst = require('../index.js');
  describe('Cap', function () {
    it('instantiates correctly', function () {
      expect(new jst.Cap()).to.be.an('object');
    });
  });
  describe('Filter', function () {
    it('instantiates correctly', function () {
      expect(new jst.Filter()).to.be.an('object');
    });
  });
  describe('Invoke', function () {
    it('instantiates correctly', function () {
      expect(new jst.Invoke()).to.be.an('object');
    });
  });
  describe('DeleteProperties', function () {
    it('instantiates correctly', function () {
      expect(new jst.DeleteProperties()).to.be.an('object');
    });
  });
  describe('RenameProperties', function () {
    it('instantiates correctly', function () {
      expect(new jst.RenameProperties()).to.be.an('object');
    });
  });
  describe('Interweave', function () {
    it('instantiates correctly', function () {
      expect(new jst.Interweave()).to.be.an('object');
    });
  });
  describe('Join', function () {
    it('is a function', function () {
      expect(jst.join).to.be.an('function');
    });
  });
});
