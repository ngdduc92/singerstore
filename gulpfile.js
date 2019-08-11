const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('apidoc', done => {
	apidoc(
		{
			src: './src/shopservice/server/routes',
			dest: './docs/apidoc'
		},
		done
	);
});

gulp.task('watch', () => {
	gulp.watch(['./src/shopservice/server/routes/**'], ['apidoc']);
});
