var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-include');
var compiler = require('google-closure-compiler').gulp();
var uglify = require('gulp-uglify');
var purify = require('gulp-purifycss');
const autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');

//DEVELOPMENT TASKS
gulp.task('css', function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist/"));
});

gulp.task('include', function () {
    return gulp.src("src/index.html")
        .pipe(include())
        .pipe(gulp.dest("./"));
});

gulp.task('default', gulp.series('css', 'include'));

gulp.task('watch', gulp.series('default', function () {
    return gulp.watch('src/**/*.{js,html,scss}', gulp.series('default'));
}));


//DISTRIBUTE TASKS
gulp.task('distributehtml', function () {
    return gulp.src('src/index.html')
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     conservativeCollapse: true,
        //     removeComments: true,
        //     ignoreCustomComments: [ /^=require/, /^=include/, /^newline/ ]
        // }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('distributepages', function () {
    return gulp.src('src/pages.html')
        .pipe(include()).on('error', console.log)
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     conservativeCollapse: true,
        //     removeComments: true,
        // }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('distributeFaviconHead', function () {
    return gulp.src('src/faviconHead.html')
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     conservativeCollapse: true,
        //     removeComments: true,
        // }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('distributejs2', function () {
    //Anleitung für externs als file einlesen: https://medium.com/dev-channel/polymer-the-closure-compiler-e80dd249d9d7
    //zusammenfassung: externsSrc = fs.readFileSync(...), externs: [{'src': externsSrc, 'path': 'asdf.js'}],

    return gulp.src('src/masterscript.js')
        .pipe(include())

        .pipe(compiler({
            compilation_level: 'WHITESPACE_ONLY',
            warning_level: 'VERBOSE',
            // externs: [
            //     { 'src': "var exports;var module; var define;var mdc;" }
            // ],
            // outputWrapper: '(function(){\n%output%\n}).call(this)',

            // jsCode: [{ 'src': 'src/**/*.js' }],
            // moduleResolutionMode: "NODE",
            // processCommonJsModules: true,            

            js_output_file: 'dist/masterscript.js',
            // js_compiler: true
            //createSourceMap: true,
        }, {
                platform: "javascript"
            }))


        // .pipe(sourcemaps.write(''))
        
        .pipe(gulp.dest('./'));

})

gulp.task('distributejs', function () {
   
    return gulp.src('src/masterscript.js')
        .pipe(include())
        .pipe(uglify({warnings: "verbose"}))
        .pipe(gulp.dest('./dist/'));

})


gulp.task('distributecss', gulp.series(gulp.parallel('distributejs', 'distributehtml', 'distributepages', 'distributeFaviconHead'), function () {
    return gulp.src('src/style.scss')
        .pipe(sass({ outputStyle: 'compressed', includePaths: 'node_modules' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(purify(['dist/masterscript.js', 'dist/index.html', 'dist/pages.html'], {
            minify: true,
            //rejected: true,
            whitelist: ['*:not*'] //fix, weil purifycss alles mit :not entfernt
        }))
        .pipe(include())
        .pipe(gulp.dest('./dist/'))
}));

gulp.task('distribute', gulp.series('distributecss', function () {
    return gulp.src('dist/index.html')
        .pipe(include()).on('error', console.log)
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
        }))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('./public'))

}));
