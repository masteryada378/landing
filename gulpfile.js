const gulp = require('gulp');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass  = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const autoprefixer = require('gulp-autoprefixer');

// Настройка сервера
gulp.task('server', ()=>{
    browserSync.init({
        server: {
            port: 9000,
            baseDir: 'build'
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload)
})

//коомпеляция PUG

gulp.task('pug', ()=>{
    return gulp.src('source/template/index.pug')
                .pipe(
                    pug({pretty: true})
                )
                .pipe(gulp.dest('build'))
})

//коомпеляция css       вписать сюда!!!
gulp.task('scss', ()=>{
    return gulp.src('source/styles/main.scss')
                .pipe(
                    sass({outputStyle: 'compressed'})
                    .on('error', sass.logError)
                )
                .pipe(
                    rename('main.min.css')   
                )
                .pipe(autoprefixer({
                    browsers: ['last 7 version'],
                    cascade: false
                }))
                .pipe(gulp.dest('build/css'))
})


//- JS 

gulp.task('sprite', (cb)=>{
    const data = gulp.src('source/images/icons/*.png')
                    .pipe(
                        spritesmith({
                            imgName : 'sprite.png',
                            imgPath : '../images/sprite.png',
                            cssName : 'sprite.scss'
                        })
                    );
    data.img.pipe(gulp.dest('build/images'));
    data.css.pipe(gulp.dest('source/styles/global'));
    cb();
})


//delete 

gulp.task('clean', (cb)=> rimraf('build', cb));

// копируем шрифты

gulp.task('copy:fonts', ()=>{
    return gulp.src('source/fonts/**/*.*')
            .pipe(gulp.dest('build/fonts'))
})

//копируем картинки

gulp.task('copy:images', ()=>{
    return gulp.src('source/images/**/*.*')
            .pipe(gulp.dest('build/images'))
})

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'))

//наблюдатели 

gulp.task('watch', ()=>{
    gulp.watch('source/template/**/*.pug', gulp.series('pug'));
    gulp.watch('source/styles/**/*.scss', gulp.series('scss'));
    //gulp.watch js
})

gulp.task('default', gulp.series('clean', gulp.parallel('pug', 'scss', 'sprite', 'copy'), gulp.parallel('watch', 'server')));
