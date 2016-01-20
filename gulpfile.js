/**
 * @author Kabir Baidhya
 */

// Require stuffs
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

// Constants
var SOURCE_PATH = './src/Http.js';
var DEST_FOLDER = './dist/';
var DEST_FILENAME = 'http.js';

gulp.task('browserify', function () {
    gulp.src(SOURCE_PATH)
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(rename(DEST_FILENAME))
        .pipe(gulp.dest(DEST_FOLDER))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST_FOLDER));
});

gulp.task('default', ['browserify']);
