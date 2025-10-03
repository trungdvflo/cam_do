'use strict'

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
// var sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var del = require('del');
var replace = require('gulp-replace');
var minifyCSS = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");
var install = require("gulp-install");
const minify = require('gulp-minify');
const fs = require('fs');

//gulp.src(['./bower.json', './package.json'])
//  .pipe(install());
var ver = '';
try{
    ver = fs.readFileSync('../serverAPI/version.txt','utf8');
    ver = ver.replace('\n', '');
    ver = ver.trim()
}catch(err){
    console.log('errr read version::', err);
}
var pathserver = {
    dist: '../build_server',
};
var ver_path = '';
if(ver != ''){
    ver_path = '/'+ver;
}
gulp.paths = {
    dist: pathserver.dist + '/client' + ver_path,
    // dist: './dist',
};

var paths = gulp.paths;

// Static Server + watching scss/html files
gulp.task('serve', async function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch('views/**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

    gulp.watch('themes/**/*.html').on('change', browserSync.reload);
    gulp.watch('themes/**/*.js').on('change', browserSync.reload);
});

// Static Server without watching scss files
gulp.task('serve:lite', async function() {

    browserSync.init({
        server: "./"
    });

    // gulp.watch('**/*.css').on('change', browserSync.reload);
    gulp.watch('views/**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

gulp.task('sass', function () {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// gulp.task('sass:watch', function () {
//     gulp.watch('./scss/**/*.scss');
// });

gulp.task('clean:dist', function () {
    return del(paths.dist, {force: true});
});

gulp.task('copy:bower', function () {
    return gulp.src(mainBowerFiles(['**/*.js', '!**/*.min.js']))
        .pipe(gulp.dest(paths.dist+'/js/libs'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist+'/js/libs'));
});

gulp.task('copy:bowermin', function () {
    return gulp.src(mainBowerFiles(['**/*.min.js']))
        .pipe(gulp.dest(paths.dist+'/js/libs'));
});

gulp.task('copy:bowercss', function () {
    return gulp.src(mainBowerFiles(['**/*.css', '!**/*.min.css']))
        .pipe(gulp.dest(paths.dist+'/js/libs'));
});

gulp.task('comp:bowercss', function () {
    return gulp.src(paths.dist+'/js/libs/*.css')
		.pipe(minifyCSS({keepBreaks:false}))
		.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist+'/js/libs'));
});

gulp.task('copy:css', function() {
   return gulp.src('./css/**/*')
   .pipe(minifyCSS({keepBreaks:false})) // minifying file
   .pipe(gulp.dest(paths.dist+'/css'));
});

gulp.task('copy:img', function() {
   return gulp.src('./img/**/*')
   .pipe(gulp.dest(paths.dist+'/img'));
});

gulp.task('copy:libsimg', function() {
    return gulp.src(mainBowerFiles(['**/*.png', '**/*.jpg', '**/*.gif']))
        .pipe(gulp.dest(paths.dist+'/js/libs/images/'));
});

gulp.task('copy:fonts', function() {
   return gulp.src('./fonts/**/*')
   .pipe(gulp.dest(paths.dist+'/fonts'));
});

gulp.task('copy:js', function() {
   return gulp.src(['./js/**/*', '!./js/configs.js']).pipe(gulp.dest(paths.dist+'/js'));
});

gulp.task('copy_comp:js', function() {
    return gulp.src(['./js/**/*', '!./js/common.js', '!./js/configs.js', '!./js/app.js'])
     .pipe(uglify().on('error', function(uglify) {
         this.emit('end');
     }))
     .pipe(gulp.dest(paths.dist+'/js'));
 });

gulp.task('copy:views', function() {
   return gulp.src('./views/**/*')
   .pipe(gulp.dest(paths.dist+'/views'));
});

gulp.task('copy:themes', function() {
    return gulp.src('./themes/**/*')
    .pipe(gulp.dest(paths.dist+'/themes'));
 }); 

gulp.task('copy:html', function() {
    var domain = '.', i = process.argv.indexOf("--domain");
    if(i>-1) {
        domain = process.argv[i+1];
        domain = domain+ver_path;
    }
   return gulp.src('index.html')
   .pipe(replace('href="./', 'href="'+ver_path+'/'))
   .pipe(replace('src="js/', 'src="'+ver_path+'/js/'))
   .pipe(replace('src="bower_components/', 'src="'+ver_path+'/bower_components/'))
   .pipe(replace('<base href="/">', '<base href="'+ver_path+'/">'))
   .pipe(gulp.dest(paths.dist+'/'));
});

gulp.task('replace:bower', function(){
    return gulp.src([
        paths.dist+'/**/*.html',
        paths.dist+'/**/*.js',
    ], {base: './'})
    .pipe(replace(/bower_components+.+(\/[a-z0-9][^/]*\.[a-z0-9]+(\'|\"))/ig, 'js/libs$1'))
    .pipe(gulp.dest('./'));
});

gulp.task('comp:html', function() {
    return gulp.src(paths.dist+'/index.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(paths.dist+'/'));
 });

 gulp.task('comp:views', function() {
    return gulp.src(paths.dist+'/views/**/*.html')
    .pipe(minifyHtml({empty:true,quotes:true,spare:true}))
    .pipe(gulp.dest(paths.dist+'/views'));
 });
 gulp.task('comp:themes', function() {
    return gulp.src(paths.dist+'/themes/**/*.html')
    .pipe(minifyHtml({empty:true,quotes:true,spare:true}))
    .pipe(gulp.dest(paths.dist+'/themes'));
 });
 
gulp.task('build:dist', gulp.series('clean:dist', 
    'sass',
    'copy:bower', 
    'copy:bowermin', 
    'copy:bowercss', 
    'comp:bowercss', 
    'copy:css', 
    'copy:img',
    // 'copy:libsimg', 
    'copy:fonts', 
    'copy:js', 
    'copy:views', 
    'copy:themes', 
    'copy:html', 
    'replace:bower', 
    // 'comp:html', 
    // 'comp:views',
    //'comp:themes',
    // 'copy_comp:js'
));
gulp.task('build:quick', gulp.series('sass',
    'copy:css', 
    'copy:img',
    'copy:libsimg', 
    'copy:fonts', 
    'copy:js', 
    'copy:views', 
    'copy:themes', 
    'copy:html', 
    'replace:bower', 
    'comp:html', 
    'comp:views',
    'comp:themes'
));

gulp.task('default', gulp.series('serve',function(callback) {
    callback
}));

// ===================

gulp.task('del_server', function() {
   return del('../build_server', {force: true});
});
gulp.task('com_cnt', function() {
    return gulp.src(['../serverAPI/controllers/**/*.js'
    ])
    .pipe(minify({
        ext:{
            // src:'-debug.js',
            min:'.js'
        },
        exclude: ['migrations', 'node_modules'],
        noSource: true,
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest(pathserver.dist+'/controllers'));
});
gulp.task('com_lib', function() {
    return gulp.src(['../serverAPI/lib/**/*.js'
    ])
    .pipe(minify({
        ext:{
            // src:'-debug.js',
            min:'.js'
        },
        exclude: ['migrations', 'node_modules'],
        noSource: true,
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest(pathserver.dist+'/lib'));
});
gulp.task('com_server', gulp.series(
    'com_cnt', 
    'com_lib'
    , function (done) {
    done();
}));

gulp.task('copy:server', function() {
    gulp.src(['../serverAPI/client/**/*']).pipe(gulp.dest(pathserver.dist+'/client'));
    // gulp.src(['../serverAPI/config/**/*']).pipe(gulp.dest(pathserver.dist+'/config'));
    gulp.src(['../serverAPI/helpers/**/*']).pipe(gulp.dest(pathserver.dist+'/helpers'));
    gulp.src(['../serverAPI/logs/index.js']).pipe(gulp.dest(pathserver.dist+'/logs'));
    gulp.src(['../serverAPI/models/**/*']).pipe(gulp.dest(pathserver.dist+'/models'));
    gulp.src(['../serverAPI/shells/**/*']).pipe(gulp.dest(pathserver.dist+'/shells'));
    return gulp.src(['../serverAPI/*']).pipe(gulp.dest(pathserver.dist));
 }); 

gulp.task('build:server', 
    gulp.series(
        'del_server', 
        'com_server',
        'copy:server'
));

gulp.task('build:all', 
    gulp.series(
        'build:server', 
        'build:dist'
));
gulp.task('test', gulp.series('copy:html'
));
