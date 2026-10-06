# Kettu add-ons

Dark translucent (glassmorphism) theme and a limited UI-animation plugin for [Kettu](https://codeberg.org/cocobo1/Kettu).

## Files

- `Nocturne-Glass.json` — Kettu `spec: 2` theme. Translucent semantic colors in `#RRGGBBAA` format plus a blurred chat wallpaper (`background.url` + `background.blur` + `background.alpha`).
- `manifest.json` + `index.js` — direct-install Kettu plugin (polymanifest format). `hash` is the SHA-256 of `index.js` and is required, otherwise Kettu will not download the script on first install.

The plugin only tunes React Native `LayoutAnimation.configureNext` and `Animated.timing` configs: a 320 ms / 260 ms minimum duration and `easeInEaseOut` instead of `linear`. Keyboard animations are left untouched, configs are cloned (Discord presets are not mutated), and every patch is removed in `onUnload`.

## Install from a public GitHub repository

Replace `OWNER` and `REPOSITORY` with the account and repository names:

- Theme: `https://raw.githubusercontent.com/OWNER/REPOSITORY/main/Nocturne-Glass.json`
- Plugin folder: `https://raw.githubusercontent.com/OWNER/REPOSITORY/main/`

For this repository:

- Theme: <https://raw.githubusercontent.com/happy-g0ose/kettu-addons/main/Nocturne-Glass.json>
- Plugin: <https://raw.githubusercontent.com/happy-g0ose/kettu-addons/main/>

The repository must be public so Kettu can fetch the files without your GitHub sign-in. For the plugin, paste the folder URL with the trailing slash, not a URL to `manifest.json` or `index.js`.

## Scope

- Translucent surfaces: yes.
- Real blur: yes, but **only** for the wallpaper image in the chat area (React Native `ImageBackground` `blurRadius`). Panels, sheets and modals are **not** backdrop-blurred — they only receive translucent colors. `background.alpha` (0–1) is how visible the wallpaper is.
- The plugin cannot change system/native animations, keyboard animations, navigation transitions, Reanimated animations or frame rate. It only affects animations that Discord starts through the two patched JS APIs.

## Target

Prepared against Kettu upstream JS source at commit `f5bbcecade9ad508f06d7886af7d79dd5570ec4f` (build-info `v1.4.3`), verified against the Android native side (`KettuXposed` → `ThemesModule.kt`, which parses `#RRGGBBAA`). iOS was not verified. Runtime on a device was not verified either.

## Verifying the files

```bash
node --check index.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json','utf8')); console.log('OK')"
node -e "JSON.parse(require('fs').readFileSync('Nocturne-Glass.json','utf8')); console.log('OK')"
```

After editing `index.js`, recompute `hash` as the SHA-256 of the file, otherwise updates will not be picked up.
