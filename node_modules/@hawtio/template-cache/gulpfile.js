var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsConfig = require('./tsconfig.json');

gulp.task('clean', function() {
  return del('dist/**/*');
});

gulp.task('tsc', ['clean'], function() {
  tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(tsConfig.include, ['reload']);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 2772
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('build', ['tsc']);
gulp.task('default', ['build', 'connect', 'watch']);
