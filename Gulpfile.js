// Include Gulp
var gulp = require('gulp');
// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
//var pngquant = require('imagemin-pngquant'); can be added in next release
var map = require('map-stream');

// Define default destination folder
var dest = 'www/';
var jsFiles = ['./js/*','./js/modules/store/**','./js/modules/product/**','./js/modules/cart/**'];
var fontFiles = ['fonts/**'];
var dataFiles = ['./data/**'];
var imgFiles = ['./images/**'];
var htmlFiles = ['index.html'];
var PartialHtmlFiles = ['./partials/**'];
var cssFiles = ['css/**'];
var jshintError = false;

var myReporter = function(file, cb) {
    return map(function(file, cb) {
        if (!file.jshint.success) {
            file.jshint.results.forEach(function (err) {
                if (err) {
                    jshintError = true;
                }
            });
        }
        cb(null, file);
    });
};

var onError = function (err) {
    console.log(err);
};

gulp.task('js', ['jscheck'],function() {
    if(jshintError === false){
        return gulp.src(plugins.mainBowerFiles().concat(jsFiles))
            .pipe(plugins.filter('*.js'))
            .pipe(plugins.ngAnnotate())
            .pipe(plugins.concat('main.js'))
            .pipe(plugins.uglify({output: {ascii_only: true}}))
            .pipe(gulp.dest(dest + 'js'));
    }else{
        jshintError = false;
        return;
    }
});

gulp.task('jscheck', function() {
  return gulp.src(jsFiles)
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(myReporter());
});

gulp.task('images', function() {
    /** Later Version Updates :
     *
     .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
     */
    gulp.src(imgFiles)
        .pipe(gulp.dest(dest + 'images'));

});

gulp.task('data', function() {

    gulp.src(dataFiles)
        .pipe(gulp.dest(dest + 'data'));

});

gulp.task('html', function() {

    var opts = {
        conditionals: true,
        spare:true,
        output: {ascii_only: true}
    };

    gulp.src(htmlFiles)
        .pipe(plugins.filter(['*.htm','*.html']))
        .pipe(plugins.minifyHtml(opts))
        .pipe(gulp.dest(dest));

});

gulp.task('partials', function() {

    var opts = {
        conditionals: true,
        spare:true,
        output: {ascii_only: true}
    };

    gulp.src(PartialHtmlFiles)
        .pipe(plugins.filter(['*.htm','*.html']))
        .pipe(plugins.minifyHtml(opts))
        .pipe(gulp.dest(dest+ 'partials'));

});

gulp.task('css', function() {
    gulp.src(plugins.mainBowerFiles().concat(cssFiles))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.order([
            'normalize.css',
            '*'
        ]))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('fonts', function() {
    gulp.src(plugins.mainBowerFiles().concat(fontFiles))
        .pipe(plugins.filter(['*.woff','*.ttf','*.svg','*.woff2','*.eot']))
        .pipe(gulp.dest(dest + 'fonts'));
});

gulp.task("watch", function() {
    gulp.watch(jsFiles, ['jscheck','js']);
    gulp.watch(fontFiles, ['fonts']);
    gulp.watch(htmlFiles, ['html']);
    gulp.watch(PartialHtmlFiles, ['partials']);
    gulp.watch(dataFiles, ['data']);
    gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['js','fonts','images','html','partials','data']);