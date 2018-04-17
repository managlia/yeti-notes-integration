const gulp = require('gulp');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const zip = require('gulp-zip');

//file paths
const DIST_PATH = 'dist';
const SCRIPTS_PATH = 'api/**/*.js';

// scripts
gulp.task('scripts', () => {
    console.log('starting scripts task');
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(), (error) => {
            console.log('Scripts Task Error');
            console.log('err: ' + error);
            this.emit('end');
        })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

gulp.task('develop', function () {
    const stream = nodemon({script: './server.js'});
    stream
        .on('restart', () => console.log('restarted!'))
        .on('crash', () => stream.emit('restart', 10))
});

gulp.task('clean', () => {
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('export', () => {
    return gulp.src('api/**/*')
        .pipe(zip('appserver.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['clean', 'scripts'], () => {
    console.log('starting default task');
});

gulp.task('watch', ['default'], () => {
    console.log('starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
});
