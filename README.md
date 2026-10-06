# Kettu add-ons

Dark translucent (glassmorphism) theme and a limited UI-animation plugin for [Kettu](https://codeberg.org/cocobo1/Kettu).

## Files

- `Nocturne-Glass.json` — Kettu `spec: 2` theme (v1.2.0). Strongly translucent semantic colors in `#RRGGBBAA` format plus a blurred chat wallpaper (`background.url` + `background.blur` + `background.alpha`).
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

## Wallpaper

```json
"background": {
  "url": "https://wide-w.com/wp-content/uploads/2019/09/1tele-fon-720x1080.jpg",
  "blur": 12,
  "alpha": 0.75
}
```

- The image is drawn by `ImageBackground` behind the **chat screen only** (Kettu patches `Messages.tsx`). Other screens have no wallpaper, they just show the translucent colors over the app's black base.
- `alpha` (0–1) is the wallpaper's own weight: the chat container then gets an overlay of `1 - alpha`. Current value `0.75` leaves only a 25% dark tint, so the picture is clearly visible; drop it to `0.5` if message text gets hard to read against the bright sky.
- `blur` is React Native `blurRadius` in pixels. Current `12` softens the sunset while keeping the palm and the boat recognizable; `0` gives a sharp image.
- Panel alpha (the last byte of each `#RRGGBBAA` value): main surfaces `99`/`94` (≈60%/58%), chat input `80` (50%), modal scrim `59` (35%), floating menus `C7` (78%). Lower the byte = more see-through. Menus were kept denser than the rest so their text stays readable over the wallpaper.
- The image must stay reachable from the device. Toggle: **Settings → Themes → appearance → Chat Background → Show Background**.

## Scope

- Translucent surfaces: yes — 50 of 75 semantic colors use `#RRGGBBAA`.
- Real blur: yes, but **only** for the wallpaper image in the chat area (React Native `ImageBackground` `blurRadius`). Panels, sheets and modals are **not** backdrop-blurred — they only receive translucent colors, so they look like glass only where the wallpaper is behind them.
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
