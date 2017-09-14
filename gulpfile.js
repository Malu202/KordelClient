var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-include');
var compiler = require('google-closure-compiler-js').gulp();
var purify = require('gulp-purifycss');

gulp.task('css', function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(gulp.dest(''));
});

gulp.task('removeCss', function () {
    return gulp.src('style.css')
        .pipe(purify(['dist/script.js', 'src/index.html']))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('join', ['css'], function () {
    return gulp.src("src/index.html")
        .pipe(include({}))
        .pipe(gulp.dest(""));
});

gulp.task('default', ['join']);

gulp.task('watch', ['default'], function () {
    return gulp.watch('src/*', ['default']);
})

gulp.task('distributehtml', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('distributecss', ['distributejs', 'distributehtml'], function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(purify(['dist/script.js', 'src/index.html'], {
            minify: true
        }))
        .pipe(gulp.dest(''))
});

gulp.task('distributejs', function () {
    return gulp.src('src/script.js')
        .pipe(include())
        .pipe(compiler({
            compilationLevel: 'WHITESPACE_ONLY',
            // warningLevel: 'VERBOSE',
            // outputWrapper: '(function(){\n%output%\n}).call(this)',
            jsOutputFile: 'dist/script.js',
            // createSourceMap: true,
        }))
        .pipe(gulp.dest(''));
})
gulp.task('distribute', ['distributecss'], function () {
    return gulp.src('dist/index.html')
        .pipe(include())
        .pipe(gulp.dest(''))
})