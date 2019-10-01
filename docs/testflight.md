## Using TestFlight

We use Xcode to create an archive, and then submit that to TestFlight via iTunes Connect. There more [information in this post](https://medium.com/@dmathewwws/steps-to-put-your-app-on-testflight-and-then-the-ios-app-store-10a7996411b1)

### Steps to submit a build to TestFlight

1. Open `ios/` in Xcode
2. Ensure you have setup app signing under General > Signing. This will be setup under `info@developmentseed.org` Apple Developer Account. The keysigning can be done automatically, once you add the account. If you need access, check 1Password.
3. Create an Archive. Product > Archive. This will create a build that can be submitted to TestFlight
4. Once the Archive is ready, select the option 'Distribute App', and then select `iOS App Store`.
5. Once this process is complete, you'll see the app under the [developer account](https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1457080144/testflight?section=internaltesters&subsection=testers)
