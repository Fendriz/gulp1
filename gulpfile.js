const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');

const origin = 'src';
const destination = 'build';



async function clean(cb) {
    await del(destination);
    cb();
}

function html(cb) {
    src(`${origin}/**/*.html`).pipe(dest(destination));
    cb();
}

function imgrs(cb) {
    src(`${origin}/img/*`)
    .pipe(imagemin())
    .pipe(dest(`${destination}/img/*`));
    cb();
}

function lessify(cb){
    src(`${origin}/**/styles.less`)
    .pipe(less())
    .pipe(dest(destination));
    cb();
}

function js(cb) {
    src(`${origin}/**/*.js`).pipe(dest(destination));
    cb();
}

function watcher(cb) {
    watch(`${origin}/**/*.less`).on('change', series(lessify, browserSync.reload))
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    cb();
}

function server (cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir:destination
        }
    })
    cb();
}
exports.default = series (clean,parallel(html, js, imgrs, lessify), server, watcher);
