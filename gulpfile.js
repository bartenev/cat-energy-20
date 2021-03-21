const gulp = require("gulp");

const htmlmin = require("gulp-htmlmin");

const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");

const rename = require("gulp-rename");
const del = require("del");

const uglify = require("gulp-uglify");
const pipeline = require("readable-stream").pipeline;

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp")
const svgstore = require("gulp-svgstore")

const sync = require("browser-sync").create();

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// JavaScript

const js = () => {
  return pipeline(
        gulp.src("source/js/*.js"),
        uglify(),
        gulp.dest("build/js")
  );
}

exports.js = js;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: false},
            {cleanupIDs: false}
        ]
      }),
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
}

exports.createWebp = createWebp;

// Svg sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
}

exports.sprite = sprite;

// Clean

const clean = () => {
  return del("build")
}

exports.clean = clean;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.webp",
    "source/img/**/sprite.svg",
    "source/css/**/*.{min.css,min.css.map}",
    "source/*.ico"
    ] , {
      base: "source"
    })

    .pipe(gulp.dest("build"))
}

exports.copy = copy;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
  // gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
}

// Default

exports.default = gulp.series(
  styles, server, watcher
  // clean, copy, html, styles, server, watcher
);

// Build

const build = gulp.series(
  clean, images, createWebp, sprite, styles, html, js, copy
);

exports.build = build;

