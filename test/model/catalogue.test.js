/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var Catalogue = models.Catalogue;
var shared = require('./shared');

describe('Model#Catalogue', function() {
  beforeEach(shared.createSections);
  beforeEach(shared.createCatalogues);
  afterEach(shared.removeCatalogues);
  afterEach(shared.removeSections);

  describe('Methods', function() {
    describe('Catalogue#findAllGroupedBySection(callback)', function() {
      it('should return grouped catalogues', function(done) {
        Catalogue.findAllGroupedBySection(function(err, catalogues) {
          should.exist(catalogues);
          catalogues.should.be.type('object');
          catalogues.should.have.property('Node.js');
          catalogues.should.have.property('Web 开发');
          done();
        });
      });
    });

    describe('Catalogue#findTops([limit], callback)', function() {
      it('default to return the 5 most popular catalogues', function(done) {
        Catalogue.findTops(function(err, catalogues) {
          should.exist(catalogues);
          (5 - catalogues.length >= 0).should.be.true;
          done();
        });
      });

      it('should return a specified number of catalogues', function(done) {
        Catalogue.findTops(3, function(err, catalogues) {
          should.exist(catalogues);
          (3 - catalogues.length >= 0).should.be.true;
          catalogues.should.have.length(3);
          done();
        });
      });
    });
  });
});