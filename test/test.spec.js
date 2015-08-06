var indexify = require('../index.js');
var gulp = require('gulp');
var gutil = require('gulp-util');
var assert = require('stream-assert-gulp');
var should = require('should');
var fs = require('fs');
var path = require('path');

var fixturesDir = path.join('.', 'test', 'fixtures');

describe('gulp-indexify', function() {
  describe('test-fixture', function () {
    it('should have an about file', function (done) {
      gulp.src(path.join(fixturesDir, 'about.html'))
      // assert the file 
      .pipe(assert.first(function(file) {
        (file.isBuffer()).should.be.true;
        (file.isStream()).should.be.false;
      }))
      // indicate the assert result 
      .on('end', done);
    });
  });
  
  describe('defined', function() {
    it('should be a function', function() {
      indexify.should.be.Function;
    });
  });
  
  describe('default-usage', function() {
    it('should rename files', function(done) {
      gulp.src(path.join(fixturesDir, 'about.html'))
      .pipe(indexify())
      .pipe(assert.length(1))
      .pipe(assert.first(function(file) {
        path.basename(file.path).should.equal('index.html');
      }))
      .pipe(assert.first(function(file) {
        var dirPathArray = path.dirname(file.path).split(path.sep),
        lastPathElement = dirPathArray[dirPathArray.length - 1]
        ;
        lastPathElement.should.equal('about');
      }))
      .on('end',done)
      ;
    });
    
    it('should only rename html by default', function(done) {
      gulp.src([
        path.join(fixturesDir, 'about.html'),
        path.join(fixturesDir, 'legacy.php'),
        path.join(fixturesDir, 'README.txt')
      ])
      .pipe(indexify({}))
      .pipe(assert.nth(1, function(file) {
        path.basename(file.path).should.equal('index.html');
      }))
      .pipe(assert.nth(2, function(file) {
        path.basename(file.path).should.equal('legacy.php');
      }))
      .pipe(assert.nth(3, function(file) {
        path.basename(file.path).should.equal('README.txt');
      }))
      .on('end',done)
      ;
    });

    it('should not rename index.html', function(done) {
      gulp.src([
        path.join(fixturesDir, 'index.html'),
        path.join(fixturesDir, 'about.html')
      ])
      .pipe(indexify({}))
      .pipe(assert.nth(1, function(file) {
        path.dirname(file.path).should.endWith('fixtures');
        path.basename(file.path).should.equal('index.html');
      }))
      .pipe(assert.nth(2, function(file) {
        path.dirname(file.path).should.endWith('about');
        path.basename(file.path).should.equal('index.html');
      }))
      .on('end',done)
      ;
    });
  });
  
  describe('fileExtension option', function() {
    it('should rename .php if so defined', function(done) {
      gulp.src([
        path.join(fixturesDir, 'about.html'),
        path.join(fixturesDir, 'legacy.php'),
        path.join(fixturesDir, 'README.txt')
      ])
      .pipe(indexify({
        fileExtension: '.php'
      }))
      .pipe(assert.nth(1, function(file) {
        path.basename(file.path).should.equal('about.html');
      }))
      .pipe(assert.nth(2, function(file) {
        path.basename(file.path).should.equal('index.php');
      }))
      .pipe(assert.nth(3, function(file) {
        path.basename(file.path).should.equal('README.txt');
      }))
      .on('end',done)
      ;
    });
    
    it('should accept arrays of extensions', function(done) {
      gulp.src([
        path.join(fixturesDir, 'about.html'),
        path.join(fixturesDir, 'legacy.php'),
        path.join(fixturesDir, 'README.txt')
      ])
      .pipe(indexify({
        fileExtension: ['.html', '.php']
      }))
      .pipe(assert.nth(1, function(file) {
        path.dirname(file.path).should.endWith('about');
        path.basename(file.path).should.equal('index.html');
      }))
      .pipe(assert.nth(2, function(file) {
        path.dirname(file.path).should.endWith('legacy');
        path.basename(file.path).should.equal('index.php');
      }))
      .pipe(assert.nth(3, function(file) {
        path.basename(file.path).should.equal('README.txt');
      }))
      .on('end',done)
      ;
    });
  });
  
  describe('rewriteRelativeUrls option', function() {
    it('should rewrite relative urls', function(done) {
      gulp.src(path.join(fixturesDir, 'about.html'))
      .pipe(indexify({
        rewriteRelativeUrls: true
      }))
      .pipe(assert.first(function(file) {
        var htmlContents = file.contents.toString();
        
        // changes directory for css
        htmlContents.should.containEql('../css/style.css');
        
        // does not change directory for absolute url
        htmlContents.should.containEql('href="https://maxcdn.bootstrapcdn.com');
      }))
      .on('end',done)
      ;
    });
  });
});
