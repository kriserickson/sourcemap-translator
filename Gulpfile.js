var gulp = require('gulp');
var  babel = require('gulp-babel');
var  run = require('gulp-run');
var  rename = require('gulp-rename');

gulp.task('transpile-app', function() {
  return gulp.src('app/index.es6.js')
    .pipe(babel())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('app'));
});

gulp.task('run', ['default'], function() {
  return run('electron .').exec();
});

gulp.task('default', ['transpile-app', 'run']);