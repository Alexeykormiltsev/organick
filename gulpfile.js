const {src, dest, watch, parallel}     = require('gulp');
const scss                             = require('gulp-sass')(require('sass'));
const concat                           = require('gulp-concat');
const autoprefixer                     = require('gulp-autoprefixer');
const uglify                           = require('gulp-uglify');
const imagemin                           = require('gulp-imagemin');
const browserSync                      = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: {
            baseDir:'Template/'
        }
    })
};

function styles() {
    return src('Template/scss/style.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true
   }))
    .pipe(dest('Template/css'))
    .pipe(browserSync.stream())
};
function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'Template/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('Template/js'))
    .pipe(browserSync.stream())
    
}
function images() {
    return src('Template/img/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/img'))
}
function build() {
    return src([
        'Template/**/*.html',
        'Template/css/style.min.css',
        'Template/js/main.min.js',
    ], {base:'Template'})
    .pipe(dest('dist'))
}
function watching() {
    watch(['Template/scss/**/*.scss'], styles);
    watch(['Template/js/**/*.js', '!Template/js/main.min.js'], scripts);
    watch(['Template/**/*.html']).on('change', browserSync.reload);
}
exports.styles  = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.build = build;
exports.default = parallel(styles, scripts, browsersync, watching);