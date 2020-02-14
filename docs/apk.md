# Creating a release APK

## One-time setup:

1. Get the keystore `observe.keystore` file from 1Password
2. Drop this into `android/app`
3. Get the `keystore.properties` file from 1Password
4. Drop the `keystore.properties` file into `android/`

## Create the release:

```
cd android
./gradlew clean
./gradlew assemble
```

You'll find the release in this directory: `android/app/build/outputs/apk/release/`

The APK can be installed on a device via the command line.

From the `android/` directory:

```bash
adb install app/build/outputs/apk/release/{filename}.apk
```
