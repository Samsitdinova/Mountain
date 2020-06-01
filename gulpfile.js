"use strict";
// ------------------------------------------ //
// 01 ПАКЕТЫ
// ------------------------------------------ //
var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");

/* Пакеты для минифаикации стилей */
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

/* Пакет для локального сервера */
var server = require("browser-sync").create();

// ------------------------------------------ //
// 02 ТАСКИ
// ------------------------------------------ //

/* Таска на обработку стилей */
gulp.task("css", function () {
  return gulp.src("./sass/styles.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("./css"))
    .pipe(server.stream());
});

/* Таска для локального сервера */
gulp.task("server", function () {
  server.init({
    server: "./",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("./sass/**/*.{sass,scss}", gulp.series("css"));
  gulp.watch("./*.html", gulp.series("refresh")).on("change", server.reload);
});

/* Таска для обновления сервера */
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

// ------------------------------------------ //
// 03 СЕРИИ ТАСОК
// ------------------------------------------ //

/* Серия тасок на сборку проекта */
gulp.task("start", gulp.series("css", "server"));
