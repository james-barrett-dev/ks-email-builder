# KS Email Builder

This project is designed to help the KidStart marketing department build responsive email templates using SCSS for styling and Handlebars for templating. The build process includes CSS inlining, media query grouping, HTML minification, removal of unused CSS, and serving the files via a local development server.

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
- **Local Development Server**: Serve the built emails locally via a BrowserSync server for real-time previews and updates.

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
  /emails          # Email templates
  /components      # Components used in templates
  /images          # Local image assets
  /fonts           # Webfonts
/dist              # Final build output (HTML emails, CSS files, images)
/config.json       # Configuration for production URLs
```

## Gulp Tasks

### `gulp build:dev`

This task is used for development. It watches for changes in SCSS and Handlebars files and automatically rebuilds them when changes are detected. Additionally, it runs a local development server to preview the emails in real time.

```bash
gulp build:dev
```

- **Local Server**: The `build:dev` task starts a BrowserSync server that serves the files from the `dist` folder. You can view the emails locally by navigating to `http://localhost:3000` in your browser. Changes to SCSS or Handlebars files will automatically trigger a rebuild and refresh the browser.

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
9. Copy fonts to the `dist` folder.
10. Replace local image and font paths in the HTML and CSS files. Optionally, use an external URL if specified.

#### Using a Local Image and Font Path (default)

If you want to keep the local image paths (`./images/`) and font paths (`./fonts/`), simply run:

```bash
gulp build:prod
```

#### Using an External Image and Font Host

If you want to use an external image or font host (for production), you can provide the external URL using the `--env=prod` flag. This will replace the local `../images/` and `../fonts/` paths with the specified external URLs in the root config.

```bash
gulp build:prod --env=prod
```

This will replace all instances of `../src/images/` and `../src/fonts/` with `https://your-external-host.com/images/` and `https://your-external-host.com/fonts/` respectively in both the HTML and CSS files in the `dist` folder.

## Configuration

### `config.json`

The configuration for production paths (e.g., GitHub Pages URLs) is stored in the `config.json` file located in the root of the project.

#### Example `config.json`

```json
{
  "prod": {
    "fontUrl": "https://your-username.github.io/your-repo-name/fonts/",
    "imageUrl": "https://your-username.github.io/your-repo-name/images/"
  }
}
```

- In production mode, the Gulp tasks will automatically read the production URLs from this configuration file and replace the local paths during the build process.

## How It Works

1. **SCSS Compilation**: All SCSS files located in `src/scss/` are compiled to CSS and output into the `dist/css/` directory. During the build process, autoprefixer adds vendor prefixes to ensure cross-browser compatibility.
2. **Handlebars Templating**: Handlebars templates located in `src/emails/` are compiled into HTML. Any Handlebars partials located in `src/partials/` are also loaded for reuse across multiple templates.
3. **CSS Inlining**: After building the HTML, the main CSS file is inlined into the HTML to ensure compatibility with email clients that strip external CSS.
4. **CSS Pruning**: The unused CSS is removed to reduce the size of the email.
5. **HTML Minification**: The final HTML is minified to reduce file size, making the emails faster to load.
6. **Asset Path Replacement**: The `replaceAssetPaths` task allows you to either:
   - Use local paths (`../images/` and `../fonts/`) for development or testing.
   - Replace these paths with an external URL when building for production by specifying the `--env=prod` argument or using the production URLs in `config.json`.

## Deployment

After running the `gulp build:prod` command, the production-ready HTML files will be located in the `dist/` directory and are ready to be uploaded or sent.

For deploying via GitHub Pages or another provider, you can configure the font and image URLs using the `config.json` file and the `--env=prod` option during the build process.
