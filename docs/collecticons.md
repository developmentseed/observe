# Updating Collecticons

## Prepare TTF

We use Development Seed's Collecticons across Observe. To update with a new set of Collecticons, follow these steps:
1. Update the version of collecticons-lib
2. Go to https://icomoon.io/app
3. Create a new set, and upload all the collecticons SVGs
4. Click 'Generate Font'
5. Click 'Preferences' and update font name to `collecticons`
6. Download font. This will give you a zip file with `collecticons.ttf` and a `style.css`
7. Update ` android/app/src/main/assets/fonts/Collecticons.ttf` and `ios/Observe/Collecticons.ttf` with the new ttf file.

## Create IconSet with react-native-vector-icons

To create a new icon set, run:
`./node_modules/.bin/generate-icon ~/Downloads/icomoon/style.css --componentName=Icon --fontFamily=Collecticons`

This will generate a glyphMap that we can use to replace the glyphMap in `app/components/Collecticons.js`
