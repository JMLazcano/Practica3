const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const tsc = require('gulp-typescript');

gulp.task('styles', function(){
    return gulp.src('src/sass/**/*.scss') //source files de sass
        .pipe(sass()) //transform
        .pipe(gulp.dest('assets/styles')); //folder destino
});

gulp.task('scripts', function(){
    const tsConfig = tsc.createProject('tsconfig.json');
    return tsConfig.src() //source files typescript
        .pipe(tsConfig())
        .pipe(gulp.dest('assets/scripts')); //dest folder
});

gulp.task('scripts:watch', gulp.series('scripts', function(done){
    gulp.watch('src/scripts/**/*.ts', gulp.series('scripts'));
    done();
}))

gulp.task('styles:watch', gulp.series('styles', function(done){
    gulp.watch('src/sass/**/*.scss', gulp.series('styles'));
    done();
}))

gulp.task('serve', function(done){
    const allTask = gulp.parallel('styles:watch', 'scripts:watch');
    allTask();
    done();
})

gulp.task('default', gulp.parallel('styles', 'scripts', function(done){
    done();
}));