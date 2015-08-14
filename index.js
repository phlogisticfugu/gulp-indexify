/* jshint node:true,esnext:true */
'use strict';

var eventStream = require('event-stream');
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var extend = require('extend');
var path = require('path');
var parseFilePath = require('parse-filepath');
var util = require('util');

var PLUGIN_NAME = 'gulp-indexify';

function isString(s) {
	if (s === undefined || s === null) return false;
	return s.constructor===String;
}

module.exports = function(options) {
  
  options = extend(false, {
    fileExtension: '.html',
    rewriteRelativeUrls: true
  }, options);
  
  var fileExtensionArray = options.fileExtension;
  
  if (! util.isArray(fileExtensionArray) && isString(fileExtensionArray)) {
    fileExtensionArray = [fileExtensionArray];
  }
  
  return through2.obj(function(file, enc, callback) {

    if (file.isNull()) {
      return callback();
    }
    
    if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not currently supported'));
			return callback();
		}
    
    var parsedPathObj = parseFilePath(file.path);
    
    if (-1 === fileExtensionArray.indexOf(parsedPathObj.extname)) {
      /*
       * Skip/pass-through files that don't match our extension
       */
      return callback(null, file);
    }

    if ('index' === parsedPathObj.name) {
      /*
       * Skip/pass-through files which are already index files
       */
      return callback(null, file);
    }

    file.path = path.join(
      parsedPathObj.dirname,
      parsedPathObj.name,
      'index' + parsedPathObj.extname
    );
    
    if (options.rewriteRelativeUrls) {
      var contents = file.contents.toString();
			
			/*
			 * Match href="" and src="" URLs in the html
			 */
      var hrefSrcRegexp = new RegExp(
        '(?:href|src)\s*=\s*["\'\\(]\\s*([\\w\\_\/\\.\\-]*\\.[a-zA-Z]+)([^\\)"\']*)\\s*[\\)"\']', 'gim');
				
			/*
			 * Match srcset urls
			 */
			var srcsetRegexp = new RegExp('srcset\s*=\s*["\'\\(]\\s*([^"\'\>"]+)\\s*[\\)"\']', 'gim');
      var absoluteUrlRegexp = /^(?:\/|https?\:\/\/)/;
      
      /*
       * rewrite relative urls with an extra .. to keep things working for references
       * to other files
       */
      contents = contents.replace(hrefSrcRegexp, function(content, filePath) {
        if (! absoluteUrlRegexp.test(filePath)) {
          content = content.replace(filePath, '../' + filePath);
        }
        
        return content;
      });
			
			contents = contents.replace(srcsetRegexp, function(content, srcSetValue) {
				var pathArray = srcSetValue.split(','),
				i = pathArray.length,
				path
				;
				
				while(i--) {
					path = pathArray[i].trim();
					
					if (! absoluteUrlRegexp.test(path)) {
						content = content.replace(path, '../' + path);
					}
				}
				
				return content;
			});
      
      file.contents = new Buffer(contents);
    }
    
    return callback(null, file);
  });
};
