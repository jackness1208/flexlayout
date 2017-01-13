'use strict';
var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect');

gulp.task('default', function(){
    console.log([
        '',
        '',
        '  Ustage:' + ' gulp <command>',
        '',
        '',
        '  Commands:',
        '    ' + 'all                init project',
        ''
    ].join('\n'));
});

gulp.task('all', ['css', 'connect'], function(){

});

gulp.task('connect', function(){
    connect.server({
        root: '../',
        livereload: true,
        port: 5000
    });
});

gulp.task('css', function(){
    gulp.src('./sass/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());

});

gulp.task('watch', ['all'], function(){
    gulp.watch('./**/*.scss', ['css'], function(){
        return connect.reload();
    });
});
