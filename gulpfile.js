var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task("default", function () {
    return gulp.src('style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(gulp.dest(''));
});
gulp.task('watch', function () {
    gulp.watch('style.scss', ['default']);
    // gulp.watch('index.html')....
})