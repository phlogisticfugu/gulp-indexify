gulp-indexify
=============

Master: [![Build Status](https://secure.travis-ci.org/phlogisticfugu/gulp-indexify.png?branch=master)](https://travis-ci.org/phlogisticfugu/gulp-indexify)

*gulp-indexify* makes [Clean URLs](https://en.wikipedia.org/wiki/Semantic_URL) by leveraging standard directory indexes.

convert any of:
- `http://site.com/about.html`
- `http://site.com/about.php`
- `http://site.com/about.aspx`

into:
> `http://site.com/about/``

by actually creating
- `http://site.com/about/index.html`

and relying upon the standard directory index of most web servers.  This makes
 it simpler to change server-side technologies in the future and is better for
 SEO.

example usage:
```javascript
var gulp = require('gulp');
var indexify = require('gulp-indexify');

gulp
.task('indexify', function() {
  return gulp.src(['src/**/*.html'])
  .pipe(indexify())
  .pipe(gulp.dest('dest'))
  ;
})
```

Options
-------

Options can be passed to *gulp-indexify*:
```javascript
// ... code snippet from example
  return gulp.src(['src/**/*.html'])
  .pipe(indexify({
    fileExtension: '.php',
    rewriteRelativeUrls: true
  }))
  .pipe(gulp.dest('dest'))
  ;
// ... code snippet from example
```

- __fileExtension__ - accepts a string or array representing the file
 extension(s) searched for when renaming files.  All other files without
 matching file extensions are ignored.  When the value is an array, it must be
 an array of strings.  Note that the dot must be included.  Default: `.html`

- __rewriteRelativeUrls__ - Since we are moving the HTML pages down a level in
 the path, relative URLs in the HTML will need to be rewritten.  When this
 option is set to true that rewriting is done by `gulp-indexify`.  Default: `true`

