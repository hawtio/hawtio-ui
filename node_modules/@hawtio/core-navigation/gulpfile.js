var gulp = require('gulp');
var Server = require('karma').Server;
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsConfig = require('./tsconfig.json');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean-js', function() {
  return del('dist/*.js');
});

gulp.task('tsc', ['clean-js'], function() {
  tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(ngAnnotate())
    .pipe(gulp.dest('.'));
});

gulp.task('templates', ['tsc'], function() {
  return gulp.src(['./templates/**/*.html'])
    .pipe(templateCache({
      filename: 'templates.js',
      root: 'templates/',
      module: 'hawtio-nav'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['templates'], function() {
  return gulp.src(['./compiled.js', './templates.js'])
    .pipe(concat('hawtio-core-navigation.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', ['concat'], function() {
  return del(['./compiled.js', './templates.js']);
});

gulp.task('example-templates', function() {
  return gulp.src('./test/html/*.html')
    .pipe(templateCache({
      filename: 'example-templates.js',
      root: 'test/html',
      module: 'test'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('example-concat', ['example-templates'], function() {
  return gulp.src(['./example/src/hawtio-nav-example.js', './example-templates.js'])
    .pipe(concat('hawtio-nav-example.js'))
    .pipe(gulp.dest('./example/dist/'));
});

gulp.task('example-clean', ['example-concat'], function() {
  return del('./example-templates.js');
});

gulp.task('watch', ['build', 'build-example'], function() {
  gulp.watch(['src/**/*', 'templates/**/*'], ['build']);
  gulp.watch(['example/src/**/*', 'test/html/*.html'], ['build-example']);
  gulp.watch(['index.html', 'dist/*'], ['reload']);
});

gulp.task('connect', function() {
  gulp.watch(['index.html', 'dist/*'], ['reload']);
  connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('build', ['tsc', 'templates', 'concat', 'clean']);
gulp.task('build-example', ['example-templates', 'example-concat', 'example-clean']);
gulp.task('default', ['build', 'build-example', 'watch', 'connect', 'test']);
