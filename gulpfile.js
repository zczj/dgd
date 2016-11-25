/*
* @Author: suzhihui
* @Date:   2016-11-17 22:01:02
* @Last Modified by:   老苏
* @Last Modified time: 2016-11-24 16:29:31
*/

'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    clean        = require('gulp-clean'),
    browserSync  = require('browser-sync').create(),
    // jade         = require('gulp-jade'),
    base64       = require('gulp-base64');

//样式
gulp.task('css', function () {
  return gulp.src('src/skin/scss/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true,
      remove: true
    }))
    .pipe(base64())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/skin/css'))

})

//脚本
gulp.task('js', function () {
  return gulp.src('src/skin/js/*.js')
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/skin/js'))
})

// 图片
gulp.task('img', function() {
  return gulp.src(['src/skin/img/*','src/skin/img/**/*'])
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/skin/img'))
    // .pipe(notify({ message: 'Images task complete' }));
});

//第三方js
gulp.task('plugs', function () {
  return gulp.src(['src/skin/plugs/*','src/skin/plugs/**/*'])
    .pipe(gulp.dest('dist/skin/plugs'))
})

//jade
gulp.task('html',function () {
  return gulp.src(['src/*.html','src/**/*.html'])
    // .pipe(jade({pretty: true}))
    .pipe(gulp.dest('dist'))
});

//清理
gulp.task('clean', function () {
  return gulp.src('dist',{read: false})
  .pipe(clean());
})


gulp.task('build', function () {
  gulp.start('css','js','img','html','plugs');
});

gulp.task('serve',function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch(['src/*.html','src/**/*.html'],['html'])
  gulp.watch('src/skin/scss/*.scss', ['css']);
  gulp.watch('src/skin/js/*.js',['js']);
  gulp.watch('src/skin/img/*',['images']);
  gulp.watch(['dist/*.html','dist/**/*.html','dist/skin/css/*.css']).on('change',browserSync.reload);
})

gulp.task('default', ['serve'])