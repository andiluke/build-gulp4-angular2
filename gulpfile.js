var gulp = require('gulp');
var ts = require('gulp-typescript');
var config = require('./gulp.config.json');
var tsProject = ts.createProject('tsconfig.json');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var server = require('gulp-server-livereload');
var del = require('del');

var tsCompile = function tsCompile() {
	var tsResult = tsProject.src(config.paths.js.source) // load all files from our pathspecification
        .pipe(ts(tsProject)); // transpile the files into .js
    
    return tsResult.js.pipe(gulp.dest(config.paths.js.dest)); 
};


var sassCompile = function sassCompile() {
	return gulp.src(config.paths.css.source)
		.pipe(sass().on('error', sass.logError)) // this will prevent our future watch-task from crashing on sass-errors
	    .pipe(minifyCss({compatibility: 'ie10'})) // see the gulp-sass doc for more information on compatibilitymodes
	    .pipe(gulp.dest(config.paths.css.dest));
};


var watch = function watch(){
	var tsWatcher = gulp.watch(config.paths.js.source, tsCompile)
		.on('change', function(path, stats){
			console.log('TS File Changed: ' + path);
		});
	var sassWatcher = gulp.watch(config.paths.css.source, sassCompile)
		.on('change', function(path, stats){
			console.log('Sass File Changed: ' + path);
		});
};


var webserver = function webserver() {
	gulp.src(config.paths.web)
		.pipe(server({
			livereload: {
				enable: true,
				filter: function(filePath, cb) { // this function tells livereload what to ignore
		          cb( !(/node_modules/.test(filePath)) &&  // ignore anything in node_modules
		              !(/.*ts$/.test(filePath)) && // ignore changes to *.ts-files
		              !(/gulpfile.js$/.test(filePath)) ); // ignore changes to gulpfile.js
		        }	
			},
			defaultFile: 'index.html',
			open: true
		}));
};

var clean = function clean (done) {
	console.log('cleaning!');
	del([config.paths.js.dest + '*.js', config.paths.css.dest + '*.css']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
		done();
	});
};


var build = gulp.parallel(sassCompile, tsCompile);


var go = gulp.series(
	clean,
	build,
	gulp.parallel(watch, webserver)
);

gulp.task('default', go);



// ALSO: https://github.com/rasenplanscher/gulp-file-structure/blob/master/gulpfile.js
