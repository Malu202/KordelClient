var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-include');
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

gulp.task('join', ['css'], function () {
    gulp.src('src/index.html')
        .pipe(include({
            prefix: '@@',
            basepath: './src'
        }))
        .pipe(gulp.dest(''));
});

gulp.task('join2', ['css'], function(){
    gulp.src("src/index.html")
        .pipe(include({}))
        .pipe(gulp.dest(""));
});

gulp.task('default', ['join2']);

gulp.task('watch', function () {
    gulp.watch('src/*', ['default']);
})