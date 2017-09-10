var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
/*
gulp.task('default', function () {
    return gulp.src('style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(gulp.dest(''));
});*/

gulp.task('css', function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(gulp.dest(''));
});

// gulp.task('index', function () {
//     return gulp.src('src/index.html')
//         .pipe(gulp.dest(''));
// });

gulp.task('join', ['css'], function() {
    gulp.src('src/index.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: './src'
      }))
      .pipe(gulp.dest(''));
  });

gulp.task('default', ['join']);

gulp.task('watch', function () {
    gulp.watch('src/*', ['default']);
})