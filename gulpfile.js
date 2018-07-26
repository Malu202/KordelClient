var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-include');
var compiler = require('google-closure-compiler-js').gulp();
var purify = require('gulp-purifycss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');

gulp.task('css', function() {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(gulp.dest("./"));
});

gulp.task('removeCss', function() {
    return gulp.src('style.css')
        .pipe(purify(['dist/script.js', 'src/index.html']))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('join', function() {
    return gulp.src("src/index.html")
        .pipe(include({}))
        .pipe(gulp.dest("./"));
});

gulp.task('default', gulp.series('css', 'join'));

gulp.task('watch', gulp.series('default' , function () {
    return gulp.watch('src/*', ['default']);
}));

gulp.task('distributehtml', function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('distributejs', function () {
    //Anleitung für externs als file einlesen: https://medium.com/dev-channel/polymer-the-closure-compiler-e80dd249d9d7
    //zusammenfassung: externsSrc = fs.readFileSync(...), externs: [{'src': externsSrc, 'path': 'asdf.js'}],

    return gulp.src('src/script.js')
        .pipe(include())
        .pipe(compiler({
            compilationLevel: 'SIMPLE_OPTIMIZATIONS',
            warningLevel: 'QUIET',
            // externs: [
            //     { 'src': "var exports;var module; var define;var mdc;" }
            // ],
            // outputWrapper: '(function(){\n%output%\n}).call(this)',
            
            // jsCode: [{ 'src': '/node_modules/**' }],
            // moduleResolutionMode: "NODE",
            // processCommonJsModules: true,            
            
            jsOutputFile: 'dist/script.js',
            //createSourceMap: true,
        }))
        //.pipe(sourcemaps.write(''))
        .pipe(gulp.dest('./'));
})


gulp.task('distributecss', gulp.series(gulp.parallel('distributejs', 'distributehtml'), function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'android 4.4']
        }))
        .pipe(purify(['dist/script.js', 'src/index.html'], {
            minify: true,
            //rejected: true,
            whitelist: ['*:not*'] //fix, weil purifycss alles mit :not entfernt
        }))
        .pipe(include())
        .pipe(gulp.dest('./'))
}));

gulp.task('distribute', gulp.series('distributecss', function () {
    return gulp.src('dist/index.html')
        .pipe(include()).on('error', console.log)
        .pipe(gulp.dest('./'))
}));
