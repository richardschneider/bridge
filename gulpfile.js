'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tag_version = require('gulp-tag-version');

var paths = {
  lint: ['./lib/**/*.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
    .pipe(plugins.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(plugins.plumber(plumberConf))
        .pipe(plugins.mocha())
        .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests runned
        .on('finish', function() {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('browserify', function() {
    return browserify('./index.js', { standalone: 'bridge'})
        .bundle()
        .pipe(source('bridge.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', ['browserify'], function() {
    return gulp.src('./dist/bridge.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('bump', ['test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json', './bower.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('tag', ['compress', 'bump'], function () {
    return gulp.src(['./package.json', './bower.json', 'dist/**/*'])
        .pipe(plugins.git.add())
        .pipe(plugins.git.commit('new release'))
        .pipe(plugins.filter('package.json'))
        .pipe(tag_version());
});

gulp.task('release', ['tag'], function (cb) {
    return plugins.git.push('origin', 'master', {args: '--tags'}, function (err) {
        if (err) throw err;
        cb();
    });
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('default', ['test']);
