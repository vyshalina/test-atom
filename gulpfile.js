var gulp = require('gulp'),
	browserSync = require('browser-sync'),//обновление страницы браузера
	sass = require('gulp-sass'),// компилятор sass
	autoprefixer = require('gulp-autoprefixer'),// префиксы для браузеров
	spritesmith = require('gulp.spritesmith'),//спрайты из png
	concat = require('gulp-concat'),//объединение файлов
	//!!ПОДКЛЮЧАЕМ В САМОМ КОНЦЕ СБОРКИ ПРОЕКТА!! uncss = require('gulp-uncss'), //убираем лишний css, игнорируются стили, которые применяются к несуществующим тегам
	uglify = require('gulp-uglify'), //убирает лишнее из js
	imagemin = require('gulp-imagemin'), //оптимизация картинок
	rigger = require('gulp-rigger'), //импорт одного файла в другой, например как сборка в html кусков кода, типо чанков в modX
	rename = require('gulp-rename'),//для переименования либо добавления суффикса
	cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	merge = require('merge-stream'),
	buffer = require('vinyl-buffer');

// browser 
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
});

// sass
gulp.task('sass', function () {
	return gulp.src('app/scss/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 15 versions', '> 1%', 'ie 9-11'],
		cascade: false
	}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}))
	//.pipe(uncss({
	//      html: ['dist/*.html']
	//  }))
  .pipe(gulp.dest('dist/css'));;
});


// libs js
gulp.task('js:libs', function () {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'));
});

// main js
gulp.task('js:main', function () {
	gulp.src('app/js/*.js')
	.pipe(gulp.dest('dist/js/'))
	.pipe(browserSync.reload({stream:true}));
});


/*Спрайты из png*/
// sprite
gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css',
		imgPath: '../img/sprite.png'
	}));

	// sprite image
	var imgStream = spriteData.img
	.pipe(buffer())
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));

	// sprite css
	//var cssStream = spriteData.css
	//.pipe(gulp.dest('app/scss'));
	//return merge(imgStream, cssStream)
	//.pipe(browserSync.reload({stream:true}));
});
//# sprite of png

//Сжимаем картинки без потери качества
//gulp.task('compress', function() {
//  gulp.src('dist/img/*')
//  .pipe(imagemin())
//  .pipe(gulp.dest('dist/img'))
//});

// html builder
gulp.task('html:build', function () {
	gulp.src('app/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({stream: true}));
});

// Reset files
gulp.task('css-reset', ['sass'], function() {
	return gulp.src([
	'app/scss/reset.scss',
	'bower_components/normalize-scss/_normalize.scss'
	]) // Выбираем файлы для минификации
		.pipe(concat('reset.scss'))//Объединяем
		.pipe(sass().on('error', sass.logError))//компилим в css
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('dist/css')); // Выгружаем в папку app/css
});

//Bootstrap components
gulp.task('bootstrap', ['sass'], function() {
	return gulp.src('dist/css/bootstrap.css') // Выбираем файлы для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(gulp.dest('dist/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['html:build', 'js:libs', 'js:main', /*'sprite',*/ /*'compress',*/  'browser-sync','sass', 'css-reset', 'bootstrap'], function () {
	gulp.watch('app/scss/*.scss', ['sass', 'css-reset', 'bootstrap']);
	gulp.watch('app/*.html', ['html:build']);
	gulp.watch('app/tpl/*.html', ['html:build']);
	gulp.watch('app/img/icons/*.png', ['sprite', 'sass']);
	gulp.watch('app/js/*.js', ['js:main']);
	//gulp.watch('dist/img/*', ['compress']);
});