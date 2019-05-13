## Debugging Tips n Tricks

### React Debugging

To debug React components, the redux store, actions, and network requests fired from within the native app, install [React Native Debugger](https://github.com/jhen0409/react-native-debugger). I was able to install it simply by downloading the Zip file in [Releases](https://github.com/jhen0409/react-native-debugger/releases)

You need to ensure you don't have other instances of the JS debugger running, for eg. in the browser, and then when you fire up your app in the emulator, it should automatically connect to React Native Debugger.

To be able to inspect network requests, right-click on the left hand pane of React Native Debugger and click "Enable Network Inspect".


### Debugging Network Requests inside Webview

To debug network requests inside a WebView (for Android):

 - Navigate in App to place where Webview opens
 - Open up Chrome and go to chrome://inspect
 - You should see your emulator with the Webview inside it with a link to click "Inspect".
 - You should now get a full Dev console for the running WebView, including Network Requests.

TODO: Add instructions on WebView debugging for iOs.


### Debugging Java Errors

Open the `android` folder in Android Studio. Build and run it (click on the hammer icon and then Play icon). At the bottom, there is a `logcat` tab - switch to it to see detailed logs, including Java errors that don't show up on the `yarn run android` console.



