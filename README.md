# Kettu add-ons

This folder is ready to upload to a public GitHub repository.

## Files

- `Nocturne-Glass.json` — Kettu `spec: 2` theme with translucent semantic colors and a blurred chat wallpaper.
- `kettu-summary-easing/manifest.json` and `kettu-summary-easing/index.js` — direct-install Kettu plugin. It adjusts only React Native `LayoutAnimation.configureNext` calls; it does not change every Discord animation.

## Install from a public GitHub repository

After uploading these files to the repository's `main` branch, use these URL patterns in Kettu, replacing `OWNER` and `REPOSITORY` with the account and repository names:

- Theme: `https://raw.githubusercontent.com/OWNER/REPOSITORY/main/Nocturne-Glass.json`
- Plugin folder: `https://raw.githubusercontent.com/OWNER/REPOSITORY/main/kettu-summary-easing/`

The repository must be public so Kettu can fetch the files without your GitHub sign-in. For the plugin, paste the folder URL with the trailing slash, not a URL to `manifest.json` or `index.js`.

## Target

Prepared against Kettu upstream JS source at commit `f5bbcec` (build-info `v1.4.3`), for Android and iOS loaders that support themes and plugins. The plugin is a limited layout-animation patch, not a global animation-speed control.
