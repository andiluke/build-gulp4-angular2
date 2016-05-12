var gulp = require('gulp');
var ts = require('gulp-typescript');
var config = require('./gulp.config.json');
var tsProject = ts.createProject('tsconfig.json');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

gulp.task('default', function() {
	console.log('hello');
	console.log(config.paths.appTS);
});

var tsCompile = function tsCompileF() {
	var tsResult = tsProject.src(config.paths.appTS) // load all files from our pathspecification
        .pipe(ts(tsProject)); // transpile the files into .js
    
    return tsResult.js.pipe(gulp.dest(function(file) {
	    	return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
	    })); // save the .js in the same place as the original .ts-file
};

gulp.task('typescript', tsCompile);



var sassCompile = function() {
	return gulp.src(config.paths.appCSS)
		.pipe(sass().on('error', sass.logError)) // this will prevent our future watch-task from crashing on sass-errors
	    .pipe(minifyCss({compatibility: 'ie10'})) // see the gulp-sass doc for more information on compatibilitymodes
	    .pipe(gulp.dest(function(file) {
	    	return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
	    }));
};

gulp.task('sass', sassCompile);



gulp.task('watch', function(){
	var tsWatcher = gulp.watch(config.paths.appTS, tsCompile)
		.on('change', function(path, stats){
			console.log('TS File Changed: ' + path);
		});
	var sassWatcher = gulp.watch(config.paths.appCSS, sassCompile)
		.on('change', function(path, stats){
			console.log('Sass File Changed: ' + path);
		});
});


// TODO: finish following directions: http://www.angular.rocks/Angular2-Gulp-Workflow/



// ALSO: https://github.com/rasenplanscher/gulp-file-structure/blob/master/gulpfile.js
