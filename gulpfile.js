'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('browser-sync').create();
var plumber = require('gulp-plumber'); 
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var wait = require('gulp-wait');

gulp.task('style', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(plumber())
    .pipe(wait(500))
    .pipe(sass())
    .pipe(postcss([autoprefixer({
      browsers: ['last 10 versions', 'ie 11'],
      cascade: false})]))
    .pipe(gulp.dest('css'))
    .pipe(minify())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('css'))
    .pipe(server.stream()); // сообщаем браузеру что файл обновлен
});

gulp.task('images', function() {
  return gulp.src('img/**/*.{png, jpg, svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(img));
});

gulp.task('server', ['style'], function() {
  server.init({
    server: '.' // место где запускать 
  });

  gulp.watch('sass/**/*.scss', ['style']);
  gulp.watch('*.html').on('change', server.reload);
});
