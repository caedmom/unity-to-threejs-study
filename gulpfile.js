'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

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

gulp.task('uglify', function () {

	return gulp.src(['src/assets/js/**/*.js', '!src/assets/js/lib/**'])
		.pipe($.uglify())
		.pipe(gulp.dest('build/assets/js'))
		.pipe($.size({title: 'uglify'}));

});

// Optimize images
gulp.task('images', function () {
	return gulp.src('src/assets/img/**/*')
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
		'src/*',
		'!src/*.html'
	], {
		dot: true
	}).pipe(gulp.dest('build'))
		.pipe($.size({title: 'copy'}));
});

// Copy web fonts to build
gulp.task('fonts', function () {
	return gulp.src(['src/assets/fonts/**'])
		.pipe(gulp.dest('build/assets/fonts'))
		.pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
	// For best performance, don't add Sass partials to `gulp.src`
	return gulp.src([
			'src/assets/scss/*.scss',
			'src/assets/css/**/*.css'
		])
			.pipe($.sourcemaps.init())
			.pipe($.changed('.tmp/styles', {extension: '.css'}))
			.pipe($.sass({
				precision: 10,
				onError: console.error.bind(console, 'Sass error:')
			}))
			.pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
			.pipe($.sourcemaps.write())
			.pipe(gulp.dest('.tmp/styles'))
			// Concatenate and minify styles
			.pipe($.if('*.css', $.csso()))
			.pipe(gulp.dest('build/assets/css'))
			.pipe($.size({title: 'styles'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
	var assets = $.useref.assets({searchPath: '{.tmp,src}'});

	return gulp.src('src/**/*.html')
		.pipe(assets)
		// Concatenate and minify JavaScript
		// .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))

		// Concatenate and minify styles
		// In case you are still using useref build blocks
		.pipe($.if('*.css', $.csso()))
		.pipe(assets.restore())
		.pipe($.useref())
		// Update production Style Guide paths
		// .pipe($.replace('components/components.css', 'components/main.min.css'))
		// Minify any HTML
		.pipe($.if('*.html', $.minifyHtml()))
		// Output files
		.pipe(gulp.dest('build'))
		.pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'build/*', '!build/.git'], {dot: true}));


gulp.task('default', ['clean'], function (cb) {
	runSequence('styles', ['jshint', 'html', 'uglify', 'images', 'fonts', 'copy'], cb);
});