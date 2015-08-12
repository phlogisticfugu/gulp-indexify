gulp-indexify
=============

Master: [![Build Status](https://secure.travis-ci.org/phlogisticfugu/gulp-indexify.png?branch=master)](https://travis-ci.org/phlogisticfugu/gulp-indexify)

*gulp-indexify* makes [Clean URLs](https://en.wikipedia.org/wiki/Semantic_URL) by leveraging standard directory indexes.

convert any of:
- `http://site.com/about.html`
- `http://site.com/about.php`
- `http://site.com/about.aspx`

into:
- `http://site.com/about/` 

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

# Options

Options can be passed to *gulp-indexify*:
```javascript
// ... code snippet from example
  return gulp.src(['src/**/*.html'])
  .pipe(indexify({
    fileExtension: ['.php','.html'],
    rewriteRelativeUrls: true
  }))
  .pipe(gulp.dest('dest'))
  ;
// ... code snippet from example
```

## __fileExtension:__
Accepts a string or array of strings representing the file
 extension(s) for the files to rename.  When renaming, the file extension is preserved, just the base file name is changed to index.  Note that the dot for the file extension must be included.  Default: `.html`

Example:
```javascript
fileExtension: '.about.aspx'
```
changes `about.aspx` into `about/index.aspx`.  But ignores `map.html`

## __rewriteRelativeUrls:__
Since we are moving the HTML pages down a level in
 the path, relative URLs in the HTML will need to be rewritten.  When this
 option is set to true that rewriting is done by `gulp-indexify`.  Default: `true`

Example:

When renaming `about.html` to `about/index.html`

changes:
```html
  <link rel="stylesheet" type="text/css" href="assets/style.css">
```

into:
```html
  <link rel="stylesheet" type="text/css" href="../assets/style.css">
```

But leaves untouched/ignores:
```html
  <!-- root relative URLs -->
  <link rel="stylesheet" type="text/css" href="/assets/default.css">

  <!-- absolute URLs -->
  <link rel="stylesheet" type="text/css"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
  >
```
