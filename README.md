# Email Builder Project

This project is designed to help the KidStart marketing department build responsive email templates using SCSS for styling and Handlebars for templating. The build process includes CSS inlining, media query grouping, HTML minification, and removal of unused CSS.

## Author

This project was created and maintained by James Barrett.

## Features

- **SCSS Compilation**: Compile SCSS files to CSS with automatic prefixing for cross-browser compatibility.
- **Handlebars Templating**: Build email templates using Handlebars, with support for reusable partials.
- **Media Query Grouping**: Automatically group and optimize CSS media queries.
- **CSS Inlining**: Inline CSS into HTML to ensure proper rendering in email clients.
- **Unused CSS Removal**: Automatically prune unused CSS to reduce file size.
- **HTML Minification**: Minify HTML files to reduce file size for production.
- **File Watching**: Watch for changes in SCSS and Handlebars files and rebuild automatically during development.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/james-barrett-dev/ks-email-builder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd email-builder
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Project Structure

```bash
/src
  /scss            # SCSS files for styling emails
  /emails          # Handlebars email templates
  /partials        # Handlebars partials used in templates
  /images          # Local image assets
  /css             # Generated CSS (output from SCSS compilation)
  /dist            # Final build output (HTML emails, CSS files, images)
```

## Gulp Tasks

### `gulp build:dev`

This task is used for development. It watches for changes in SCSS and Handlebars files and automatically rebuilds them when changes are detected.

```bash
gulp build:dev
```

### `gulp build:prod`

This task is used to create a production-ready version of the emails. It performs the following steps:

1. Compile SCSS to CSS and prefix styles.
2. Group media queries.
3. Build Handlebars templates into HTML.
4. Unescape special HTML characters.
5. Inline the CSS into the HTML.
6. Remove unused CSS.
7. Minify the final HTML output.
8. Copy images to the `dist` folder.
9. Replace local image paths in the HTML and CSS files. Optionally, use an external URL if specified.

#### Using a Local Image Path (default)

If you want to keep the local image paths (`./images/`), simply run:

```bash
gulp build:prod
```

#### Using an External Image Host

If you want to use an external image host (for production), you can provide the external URL using the `--prod-url` flag:

```bash
gulp build:prod --prod-url https://your-external-image-host.com/images/
```

This will replace all instances of `../src/images/` with `https://your-external-image-host.com/images/` in both the HTML and CSS files in the `dist` folder.

## How It Works

1. **SCSS Compilation**: All SCSS files located in `src/scss/` are compiled to CSS and output into the `dist/css/` directory. During the build process, autoprefixer adds vendor prefixes to ensure cross-browser compatibility.
2. **Handlebars Templating**: Handlebars templates located in `src/emails/` are compiled into HTML. Any Handlebars partials located in `src/partials/` are also loaded for reuse across multiple templates.
3. **CSS Inlining**: After building the HTML, the main CSS file is inlined into the HTML to ensure compatibility with email clients that strip external CSS.
4. **CSS Pruning**: The unused CSS is removed to reduce the size of the email.
5. **HTML Minification**: The final HTML is minified to reduce file size, making the emails faster to load.
6. **Image Path Replacement**: The `replaceImagePaths` task allows you to either:
   - Use local image paths (`./images/`) for development or testing.
   - Replace image paths with an external URL when building for production, by specifying the `--prod-url` argument.

## Deployment

After running the `gulp build:prod` command, the production-ready HTML files will be located in the `dist/` directory.
