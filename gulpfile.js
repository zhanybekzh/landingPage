const del = require('del');
const gulp = require('gulp');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const browserSync = require("browser-sync");
const reload = browserSync.reload;

const config = {
    server: {
        baseDir: "."
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

gulp.task('clean:styles', () => del([
    './markup/css/*',
]));

gulp.task('lint:styles', () =>
    gulp.src('./markup/scss/**/*.s+(a|c)ss')
        .pipe(sassLint({
            configFile: 'sasslint.yml',
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
);

gulp.task('build:styles', () => {
    const prod = 'production' === process.env.NODE_ENV;
    const options = {
        outputStyle: prod ? 'compressed' : 'expanded'
    };

    return gulp.src('./markup/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(options).on('error', sass.logError))
        .pipe(prefixer('last 4 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./markup/css'))
        .pipe(reload({stream: true}));
});

gulp.task('build:html',  async () => {
     return gulp.src('./markup/html/*.html') //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('./')) //Выплюнем их в папку
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений

});
gulp.task('webserver', function () {
    browserSync(config);
  });



// gulp.watch('./markup/scss/**/*.scss', gulp.parallel('build:styles'));
// gulp.watch('./*.html', gulp.series('build:html'));
// gulp.task('styles', gulp.series('clean:styles', 'lint:styles', 'build:styles'));
gulp.watch('./markup/scss/**/*.scss', gulp.parallel('build:styles'));
gulp.watch('./markup/html/**/*.html',  gulp.parallel('build:html'));
gulp.task('styles', gulp.series('clean:styles',  'build:styles'));
gulp.task('build', gulp.series('build:html',  'styles' , 'webserver'));
