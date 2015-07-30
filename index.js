'use strict';

var eventStream = require('event-stream');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var extend = require('extend');
var path = require('path');
var parseFilePath = require('parse-filepath');

module.exports = function(options) {
  options = extend(false, {
    fileExtension: '.html',
    rewriteRelativeUrls: true
  }, options);
  
  return eventStream.map(function(file, callback) {

    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    
    if (file.isStream()) {
			this.emit('error', new PluginError('gulp-indexify', 'Streams not currently supported'));
			return callback();
		}
    
    var parsedPathObj = parseFilePath(file.path);
    
    if (parsedPathObj.extname !== options.fileExtension) {
      /*
       * Skip/pass-through files that don't match our extension
       */
      return callback(null, file);
    }

    file.path = path.join(
      parsedPathObj.dirname,
      parsedPathObj.name,
      'index' + options.fileExtension
    );
    
    if (options.rewriteRelativeUrls) {
      var contents = file.contents;
      var urlRegexp = new RegExp(
        '(?:href|src)\s*=\s*["\'\\(]\\s*([\\w\\_\/\\.\\-]*\\.[a-zA-Z]+)([^\\)"\']*)\\s*[\\)"\']', 'gim');
      var absoluteUrlRegexp = /^(?:\/|https?\:\/\/)/;
      
      if (Buffer.isBuffer(contents)) {
        /*
         * rewrite relative urls with an extra .. to keep things working for references
         * to other files
         */
        contents = contents.toString();
        
        contents = contents.replace(urlRegexp, function(content, filePath) {
          
          if (! absoluteUrlRegexp.test(content)) {
            content = content.replace(filePath, '../' + filePath);
          }
          
          return content;
        })
        
        file.contents = new Buffer(contents);
      }
    }
    
    return callback(null, file);
  });
};
