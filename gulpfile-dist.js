/*
 * @Author: suzhihui
 * @Date:   2016-11-17 22:01:02
 * @Last Modified by:   老苏
 * @Last Modified time: 2016-12-06 12:44:57
 */

// 'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  changed = require('gulp-changed'),
  debug = require('gulp-debug'),
  browserSync = require('browser-sync').create(),
  jade = require('gulp-jade'),
  base64 = require('gulp-base64');

//样式
gulp.task('css', ['css-pro'], function () {
  return gulp.src(['src/skin/scss/**/*.scss', '!src/skin/promotion/**/*.scss'])
    .pipe(changed('dist/skin/css/', { extension: '.css' }))
    .pipe(debug({ title: '编译：' }))
    //  .pipe(sourcemaps.init())
    // 嵌套输出方式 nested (默认)
    // 展开输出方式 expanded
    // 紧凑输出方式 compact
    // 压缩输出方式 compressed
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0', 'IE >= 9'],
      cascade: true,
      remove: true
    }))
    .pipe(base64({
      // 排除字体文件
      exclude: ['.eot', '.woff', '.ttf', '.svg']
    }))
    //  .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/skin/css'))
    .pipe(browserSync.reload({ stream: true }));
})

gulp.task('css-pro', function () {
  return gulp.src(['src/skin/promotion/**/*.scss'])
    .pipe(changed('dist/skin/promotion/', { extension: '.css' }))
    .pipe(debug({ title: '编译：' }))
    //  .pipe(sourcemaps.init())
    // 嵌套输出方式 nested (默认)
    // 展开输出方式 expanded
    // 紧凑输出方式 compact
    // 压缩输出方式 compressed
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0', 'IE >= 9'],
      cascade: true,
      remove: true
    }))
    .pipe(base64({
      // 排除字体文件
      exclude: ['.eot', '.woff', '.ttf', '.svg']
    }))
    //  .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/skin/promotion'))
    .pipe(browserSync.reload({ stream: true }));
})
//脚本
gulp.task('js',['js-pro'], function () {
  return gulp.src(['src/skin/js/*.js', 'src/skin/js/**/*.js'])
    .pipe(changed('dist/skin/js', { extension: '.js' }))
    .pipe(debug({ title: '编译：' }))
    // .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/skin/js'))
})
gulp.task('js-pro', function () {
  return gulp.src(['src/skin/promotion/**/*.js'])
    .pipe(changed('dist/skin/promotion', { extension: '.js' }))
    .pipe(debug({ title: '编译：' }))
    // .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/skin/promotion/'))
})
// 图片
gulp.task('img',['img-pro'], function () {
  return gulp.src(['src/skin/img/*', 'src/skin/img/**/*'])
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/skin/img'))
  // .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('img-pro', function () {
  return gulp.src(['src/skin/promotion/**/*'])
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/skin/promotion'))
  // .pipe(notify({ message: 'Images task complete' }));
});

//第三方js
gulp.task('plugs', function () {
  return gulp.src(['src/skin/plugs/*', 'src/skin/plugs/**/*'])
    .pipe(changed('dist/skin/plugs', { extension: '.plugs' }))
    .pipe(debug({ title: '编译：' }))
    .pipe(gulp.dest('dist/skin/plugs'))
})

//jade
gulp.task('jade', function () {
  return gulp.src(['src/*.jade', 'src/**/*.jade'])
    .pipe(changed('dist', { extension: '.html' }))
    .pipe(debug({ title: '编译：' }))
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});


//清理
gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
})


gulp.task('build', function () {
  gulp.start('css', 'js', 'img', 'jade', 'plugs');
});

gulp.task('serve', ['css', 'js', 'img', 'jade', 'plugs'], function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch(['src/*.jade', 'src/**/*.jade'], ['jade'])
  gulp.watch(['src/skin/scss/*.scss', 'src/skin/scss/**/*.scss', 'src/skin/promotion/**/*.scss'], ['css']);
  gulp.watch(['src/skin/js/*.js', 'src/skin/js/**/*.js'], ['js']);
  gulp.watch(['src/skin/img/*', 'src/skin/img/**/*'], ['img']);
  gulp.watch('*').on('change', browserSync.reload);
})

gulp.task('default', ['serve'])