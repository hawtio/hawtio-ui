var gulp = require('gulp');
var Server = require('karma').Server;
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

gulp.task('templates', function() {
  return gulp.src(['./templates/**/*.html'])
    .pipe(templateCache({
      filename: 'templates.js',
      root: 'templates/',
      module: 'hawtio-nav'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['templates'], function() {
  return gulp.src(['./src/hawtio-core-navigation.js', './templates.js'])
    .pipe(concat('hawtio-core-navigation.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-dts', ['templates'], function() {
  return gulp.src(['./src/hawtio-core-navigation.d.ts'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', ['concat'], function() {
  return del('./templates.js');
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
  return gulp.src(['./src/hawtio-nav-example.js', './example-templates.js'])
    .pipe(concat('hawtio-nav-example.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('example-clean', ['example-concat'], function() {
  return del('./example-templates.js');
});

gulp.task('watch', ['build', 'build-example'], function() {
  gulp.watch(['src/hawtio-core-navigation.*', 'templates/**/*.html'], ['build']);
  gulp.watch(['src/hawtio-nav-example.js', 'test/html/*.html'], ['build-example']);
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

gulp.task('build', ['templates', 'concat', 'clean', 'copy-dts']);
gulp.task('build-example', ['example-templates', 'example-concat', 'example-clean']);
gulp.task('default', ['build', 'build-example', 'watch', 'connect', 'test']);
