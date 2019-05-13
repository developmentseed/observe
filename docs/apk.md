## To build a release APK

1. Get the keystore `observe.keystore` file from 1Password
2. Drop this into `android/app`
3. Get the `keystore.properties` file from 1Password
4. Drop the `keystore.properties` file into `android/`
5. Run `./gradlew clean && ./gradlew assemble`

Look for debug and release APKs under `android/app/build/outputs`
