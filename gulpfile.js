/**
 * PART-1 development
 * --------------------------------------------
 * SASS编译CSS文件。
 * 观察app目录文件的变化, 实时更新界面。
 * 
 *
 * PART-2 build
 * --------------------------------------------
 * 优化JS CSS IMAGES 文件 复制FONTS。
 
 * PART-3 如何使用
 * --------------------------------------------
 * gulp watch -- 开发时
 * gulp build -- 发布
 * gulp clean -- 清空dist
 */

var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    minifyCSS = require('gulp-minify-css'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer');

/****************************** gulp watch *****************************************/


// 实时更新浏览器界面
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
    })
});

// 编译CSS
gulp.task('sass', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// gulp watch 
// second array taskes should be compeleted before watch !important
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});


/****************************** gulp build *****************************************/

// 压缩打包CSS,JS文件
gulp.task('useref', function () {
    return gulp.src(['app/**/*'])
        // Minifies only if it's a CSS file
        .pipe(gulpIf(['*.css', 'app/css/bootstrap/**'], minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpIf(['*.js', 'app/css/bootstrap/**'], uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});

// 编译打包图片
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// 打包字体
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// 清理多余的编译缓存
gulp.task('clean:dist', function (callback) {
    del(['dist/**/*', '!dist/images', '!dist/images/**/*']).then(paths => {
        callback()
    });
});

// gulp build 
gulp.task('build', function (callback) {
    runSequence('clean:dist', ['useref', 'images', 'fonts'],
        callback)
});

/****************************** gulp clean *****************************************/

// gulp clean
gulp.task('clean', function (callback) {
    del('dist');
    return cache.clearAll(callback);
});