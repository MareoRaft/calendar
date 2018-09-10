/*
More info: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
syncronous running: http://stackoverflow.com/questions/26715230/gulp-callback-how-to-tell-gulp-to-run-a-task-first-before-another/26715351
*/
/////////////////// IMPORTS ///////////////////
const gulp = require('gulp')

const compass = require('gulp-for-compass')
const exec = require('child_process').exec


/////////////////// GLOBALS ///////////////////
const src_scss = 'client-side/sass/**/*.scss'

const log_standard = function(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
}


///////////////////// MAIN /////////////////////
gulp.task('css', function() {
	gulp.src(src_scss)
		.pipe(compass({
			sassDir: 'client-side/sass',
			cssDir: 'client-side/css-built',
			force: true,
		}))
		// .pipe(autoprefixer({
		// 	browsers: ['last 3 versions'],
		// 	cascade: false,
		// }))
		.pipe(gulp.dest('client-side/css-built'))
})

gulp.task('watch', function() {
	// css watcher
	var watch_css = gulp.watch(src_scss, ['css'])
	watch_css.on('change', log_standard)
})

gulp.task('default', ['css', 'watch'])
