# Troubleshooting

## A black screen is showing instead of the map

Make sure you have a valid mapbox style url specified in your local .env file or have it commented out.

## A grey screen and mapbox logo but map tiles are not loading

- Open your emulator
- Go to **Settings** on the right side of your phone emulator.
- Click **Advanced** tab, and choose the **OpenGL ES Renderer** to **SwiftShader**.
- Restart required, just restart your emulator.
- Run React Native Android again.

[Source](https://github.com/mapbox/react-native-mapbox-gl/issues/1364#issuecomment-423735315)
