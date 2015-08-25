'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var browserify = require('gulp-browserify');

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src(['src/assets/js/**/*.js', '!src/assets/js/lib/**'])
		.pipe(reload({stream: true, once: true}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// gulp.task('uglify', function () {

// 	return gulp.src(['src/assets/js/**/*.js', '!src/assets/js/lib/**'])
// 		.pipe($.uglify())
// 		.pipe(gulp.dest('build/assets/js'))
// 		.pipe($.size({title: 'uglify'}));

// });

gulp.task('browserify', function () {

	return gulp.src(['src/assets/js/**/*.js', '!src/assets/js/lib/**'])
		.pipe(browserify({
			insertGlobals : false
		}))
		.pipe($.uglify())
		.pipe(gulp.dest('build/assets/js'))
		.pipe($.size({title: 'browserify'}));

});

// Optimize images
gulp.task('images', function () {
	return gulp.src('src/assets/img/**/*.{gif,jpg,png,svg}')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('build/assets/img'))
		.pipe($.size({title: 'images'}));
});

// Copy all files at the root level (src)
gulp.task('copy', function () {
	return gulp.src([
		'src/**',
		'!src/*.html',
		'!src/assets/js/*.js',
		'!src/assets/js/app/**',
		'!src/assets/img/**',
		'!src/assets/css/**'
	], {
		dot: true
	}).pipe(gulp.dest('build'))
		.pipe($.size({title: 'copy'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
	// For best performance, don't add Sass partials to `gulp.src`
	return gulp.src([
			'src/assets/scss/**/*.scss'
		])
			.pipe($.sourcemaps.init())
			.pipe($.changed('.tmp/styles', {extension: '.css'}))
			.pipe($.sass({
				precision: 10,
				onError: console.error.bind(console, 'Sass error:')
			}))
			.pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
			.pipe($.sourcemaps.write())
			// Concatenate and minify styles
			.pipe($.if('*.css', $.csso()))
			.pipe(gulp.dest('src/assets/css'))
			.pipe(gulp.dest('build/assets/css'))
			.pipe($.size({title: 'styles'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
	var assets = $.useref.assets({searchPath: '{.tmp,src}'});

	return gulp.src('src/**/*.html')
		.pipe(assets)	

		// Concatenate and minify styles
		// In case you are still using useref build blocks
		.pipe($.if('*.css', $.csso()))
		.pipe(assets.restore())
		.pipe($.useref())

		// Minify any HTML
		.pipe($.if('*.html', $.minifyHtml()))
		// Output files
		.pipe(gulp.dest('build'))
		.pipe($.size({title: 'html'}));

});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'build/*', '!build/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
	browserSync({
		notify: false,
		logPrefix: 'WSK',
		// https: true,
		server: ['src']
	});

	gulp.watch(['src/**/*.html'], reload);
	gulp.watch(['src/assets/scss/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['src/assets/js/**/*.js'], ['jshint', 'browserify', reload]);
	gulp.watch(['src/assets/img/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:build', ['styles'], function () {
	browserSync({
		notify: false,
		logPrefix: 'WSK',
		// https: true,
		server: ['build']
	});

	gulp.watch(['src/**/*.html'], reload);
	gulp.watch(['src/assets/scss/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['src/assets/js/**/*.js'], ['jshint', 'browserify', reload]);
	gulp.watch(['src/assets/img/**/*'], reload);
});

gulp.task('default', ['clean'], function (cb) {
	runSequence('styles', ['jshint', 'html', 'browserify', 'images', 'copy'], cb);
});