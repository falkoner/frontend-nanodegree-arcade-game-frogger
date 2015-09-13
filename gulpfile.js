var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concatify = require('gulp-concat'),
    imageop = require('gulp-image-optimization'),
    inject = require('gulp-inject'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),
    minifyhtml = require('gulp-minify-html');


// Paths to various files
var paths = {
    scripts: ['js/*.js'],
    css: ['css/*.css'],
    images: ['image/img/*'],
    icons: ['image/*'],
    content: ['index.html']
};

gulp.task('styles', function() {
    return gulp.src(paths.css)
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build/css/'));
});

// Concats & minifies js files and outputs them to build/js/app.js
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concatify('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js/'));
});

// Minifies our HTML files and outputs them to build/*.html
gulp.task('content', function() {
    return gulp.src(paths.content)
        .pipe(minifyhtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('./build'));
});

// Optimizes our image files and outputs them to build/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
                .pipe(imageop({
                    optimizationLevel: 5
                }))
                .pipe(gulp.dest('./build/image'));
});

// Watches for changes to our files and executes required scripts
gulp.task('scss-watch', ['styles'], browserSync.reload);
gulp.task('content-watch', ['content'], browserSync.reload);
gulp.task('image-watch', ['images'], browserSync.reload);
gulp.task('script-watch', ['scripts'], browserSync.reload);

// Launches a test webserver
gulp.task('browse', function(){
    browserSync({
        browser: ["google chrome"],
        port: 3030,
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(paths.scripts).on("change", browserSync.reload);
    gulp.watch(paths.stylesheets).on("change", browserSync.reload);
    gulp.watch(paths.content).on("change", browserSync.reload);
    gulp.watch(paths.images).on("change", browserSync.reload);
    gulp.watch(paths.icons).on("change", browserSync.reload);
});

gulp.task('build', ['scripts', 'styles','images', 'content']);
gulp.task('serve', ['browse']);
