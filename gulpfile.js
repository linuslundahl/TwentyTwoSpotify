var gulp = require('gulp'),
    $    = require('gulp-load-plugins')();

var handleError = function (err) {
  $.notify.onError()(err);
  this.emit('end');
};

// Default
gulp.task('default', function () {
  gulp.watch('TwentyTwoSpotify.js', ['scripts']);
});

// Script concat and uglify
gulp.task('scripts', function () {
  return gulp.src('TwentyTwoSpotify.js')
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.uglify())
    .pipe(gulp.dest('./'));
});
