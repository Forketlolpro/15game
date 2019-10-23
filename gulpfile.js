var gulp = require('gulp'),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		cleancss      = require('gulp-clean-css'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync');

		var configuration = {
			paths: {
				src: {
					html: 'src/*.html',
					css: 'src/style.scss',
					js: 'src/script.js'
				},
				dist: 'app'
			}
		};


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	})
});

// Sass|Scss Styles
gulp.task('styles', function() {
	return gulp.src(configuration.paths.src.css, { allowEmpty: true })
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(gulp.dest(configuration.paths.dist))
	.pipe(browserSync.stream())
});


gulp.task('scripts', function() {
	return gulp.src(configuration.paths.src.js)
	.pipe(concat('script.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest(configuration.paths.dist))
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task('code', function() {
	return gulp.src(configuration.paths.src.html)
	.pipe(gulp.dest(configuration.paths.dist))
	.pipe(browserSync.reload({ stream: true }));
});


gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		exclude: ['**/Thumbs.db', '**/*.DS_Store'],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});


gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
    gulp.watch(['src/script.js'], gulp.parallel('scripts'));
    gulp.watch('src/*.html', gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('styles', 'scripts', 'code', 'browser-sync', 'watch'));