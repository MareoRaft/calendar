/*
More info: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
syncronous running: http://stackoverflow.com/questions/26715230/gulp-callback-how-to-tell-gulp-to-run-a-task-first-before-another/26715351
*/
/////////////////// IMPORTS ///////////////////
const gulp = require('gulp')

const compass = require('gulp-for-compass')
const autoprefixer = require('gulp-autoprefixer')
// const babel = require('gulp-babel')
const exec = require('child_process').exec
// const moment = require('moment')
// const prop_reader = require('properties-reader')


/////////////////// GLOBALS ///////////////////
const src_scss = 'sass/**/*.scss'
// const src_js6 = 'www/scripts6/**/*.js'

const log_standard = function(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
}


///////////////////// MAIN /////////////////////
gulp.task('css', function() {
	gulp.src(src_scss)
		.pipe(compass({
			sassDir: 'sass',
			cssDir: 'css-built',
			force: true,
		}))
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false,
		}))
		.pipe(gulp.dest('css-built'))
})

// gulp.task('js', function() {
// 	gulp.src(src_js6)
// 		.pipe(babel({
// 			presets: ['es2015'], // Specifies which ECMAScript standard to follow.  This is necessary.
// 		}))
// 		.pipe(gulp.dest('www/scripts'))
// })

gulp.task('watch', function() {
	// css watcher
	var watch_css = gulp.watch(src_scss, ['css'])
	watch_css.on('change', log_standard)
	// js watcher
	// var watch_js = gulp.watch(src_js6, ['js'])
	// watch_js.on('change', log_standard)
})

gulp.task('default', ['css', 'watch'])
