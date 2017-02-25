const gulp = require('gulp'),
      gutil = require('gulp-util'),
      browserify = require('gulp-browserify'),
      stylish = require('jshint-stylish'),
      jshint = require('gulp-jshint'),
      w3cjs = require('gulp-w3cjs'),
      // compass = require('gulp-compass'),
      connect = require('gulp-connect'),
      gulpif = require('gulp-if'),
      uglify = require('gulp-uglify'),
      minifyHTML = require('gulp-minify-html'),
      concat = require('gulp-concat'),
      path = require('path'),
      sass = require('gulp-sass'),
      babel = require('gulp-babel');

let env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle,
    externalCss;

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

jsSources = [
  'src/scripts/lib/angular/angular.min.js',
  'src/scripts/lib/angular/angular-route.min.js',
  'src/scripts/lib/angular/angular-animate.min.js',
  // 'node_modules/ngstorage/ngStorage.js',
  'src/scripts/app.js',
  'src/scripts/services/storage.js',
  'src/scripts/services/repo.js',
  'src/scripts/controllers.js'
];
sassSources = ['src/sass/*.scss'];
externalCss = ['src/css/*.css'];
htmlSources = [outputDir + '*.html'];

gulp.task('styles', function() {
    gulp.src(sassSources)
        .pipe(sass().on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('css', function() {
    gulp.src(externalCss)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('fonts', function () {
  return gulp.src([
        'src/fonts/glyphicons-halflings-regular.*'])
      .pipe(gulp.dest(outputDir+'fonts/'));
});

gulp.task('js', function() {
  'use strict';

  gulp.src('src/scripts/script.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  'use strict';
  gulp.watch(jsSources, ['js']);
  gulp.watch(['src/sass/*.scss', 'src/sass/*/*.scss'], ['styles']);
  gulp.watch('src/views/*.html', ['html']);
});

gulp.task('connect', function() {
  'use strict';
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  'use strict';
  gulp.src('src/views/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(gulpif(env === 'development', gulp.dest(outputDir+'views')))
    .pipe(connect.reload());
});

// Copy images to production
gulp.task('move', function() {
  'use strict';
  gulp.src('src/images/**/*.*')
  .pipe(gulp.dest(outputDir+'images'));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'styles', 'fonts', 'move', 'connect']);
