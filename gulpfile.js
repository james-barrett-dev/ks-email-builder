const gulp = require('gulp');
const yargs = require('yargs');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const hb = require('gulp-hb');
const extname = require('gulp-extname');
const cssInliner = require('gulp-inline-css');
const replace = require('gulp-replace');
const fs = require('fs');
const mediaQueryGrouper = require('gulp-group-css-media-queries');
const removeUnusedCss = require('gulp-email-remove-unused-css');
const htmlMinify = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

// Get command-line arguments
const argv = yargs.option('prod-url', {
  alias: 'p',
  type: 'string',
  description: 'Use this option to provide an external URL for image hosting in production'
}).argv;

// Copy images folder from src to dist
function copyImages() {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images'));
}

// Compile SCSS to CSS external stylesheet and prefix
function compileSass() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/'));
}

// Group media queries in CSS external stylesheet
function groupMediaQueries() {
  return gulp.src('./dist/**/*.css')
    .pipe(mediaQueryGrouper())
    .pipe(gulp.dest('./dist'));
}

// Build pages
function buildPages() {
  return gulp.src('./src/emails/**/*.hbs')
    .pipe(hb()
      .partials('./src/partials/components/**/*.hbs')
    )
    .pipe(extname('.html'))
    .pipe(gulp.dest('./dist'));
}

// Replace the image paths in HTML and CSS files
function replaceImagePaths() {
  const imagePath = argv.prodUrl ? argv.prodUrl : './images/';
  
  return gulp.src(['./dist/**/*.html', './dist/**/*.css'])
    .pipe(replace(/..\/src\/images\//g, imagePath))  // Use external URL or local path
    .pipe(gulp.dest('./dist'));
}

// Unescape HTML special characters
function unescapeHtmlSpecialCharacters() {
  return gulp.src('./dist/**/*.html')
    .pipe(replace('&#x3D;', '='))
    .pipe(replace('&#x27;', '\''))
    .pipe(replace('&amp;', '&'))
    .pipe(gulp.dest('./dist'));
}

// Prune unused CSS from HTML
function pruneUnusedCss() {
  return gulp.src('./dist/**/*.html')
    .pipe(removeUnusedCss({
      whitelist: [
        '.ExternalClass',
        '.ReadMsgBody',
        '.yshortcuts',
        '.Mso*',
        '.maxwidth-apple-mail-fix',
        '#outlook',
        '.outlook',
        '.module-*',
        'img',
        'table',
        '.ow100',
        '*[class~=opadt]',
        '*[class~=onegmargt]',
        '*[class~=oheight]',
        'a[href^=tel]',
        '.mobile_link',
        '.test:hover',
        '.btn-hover:hover',
        'div[style*="margin: 16px 0;"]',
        'a[x-apple-data-detectors]',
        'td',
        'th',
        '.yahoo-hide',
        '.yahoo-show',
        '.yahoo-100',
        '.expanded',
        '.thread-item',
        '.thread-body',
        '.body',
        '.msg-body',
        '.test',
        '.btn-hover',
        '.viewemailonline',
        '.unsubscribe'
      ]
    }))
    .pipe(gulp.dest('./dist'));
}

// Inline CSS
function inlineCss() {
  return gulp.src('./dist/**/*.html')
    .pipe(replace(/<link href=".\/main.css"[^>]*>/, function() {
      var style = fs.readFileSync('./dist/main.css', 'utf8');
      return '<style type="text/css">\n' + style + '\n</style>';
    }))
    .pipe(cssInliner({
      applyLinkTags: true,
      removeStyleTags: false,
      removeLinkTags: false
    }))
    .pipe(gulp.dest('./dist'));
}

// Minify HTML
function minifyHtml() {
  return gulp.src('./dist/**/*.html')
    .pipe(htmlMinify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
}

// Static server
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    host: '0.0.0.0',
    port: 3000,
    open: false
  });

  gulp.watch('src/**/*').on('change', browserSync.reload);
}

gulp.task('copyImages', copyImages);
gulp.task('compileSass', compileSass);
gulp.task('groupMediaQueries', groupMediaQueries);
gulp.task('buildPages', buildPages);
gulp.task('replaceImagePaths', replaceImagePaths);
gulp.task('unescapeHtmlSpecialCharacters', unescapeHtmlSpecialCharacters);
gulp.task('pruneUnusedCss', pruneUnusedCss);
gulp.task('inlineCss', inlineCss);
gulp.task('minifyHtml', minifyHtml);
gulp.task('serve', serve);

// Watch for changes in SCSS and Handlebars files
function watch() {
  gulp.watch('./src/**/**/*.hbs', gulp.series(copyImages, compileSass, buildPages, replaceImagePaths));
}

// Run this task when creating an email or editing / creating components
gulp.task('build:dev', gulp.parallel(watch, serve));

// Run this task when publishing the emails for code review
gulp.task('build:publish', gulp.series(
  'copyImages',
  'compileSass',
  'groupMediaQueries',
  'buildPages',
  'replaceImagePaths',
  'unescapeHtmlSpecialCharacters',
  'inlineCss',
  'pruneUnusedCss',
));

// Run this task to package email for flight
gulp.task('build:prod', gulp.series(
  'copyImages',
  'compileSass',
  'groupMediaQueries',
  'buildPages',
  'replaceImagePaths',
  'unescapeHtmlSpecialCharacters',
  'inlineCss',
  'pruneUnusedCss',
  'minifyHtml'
));