# Observe change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [v0.2.2] - 2020-02-21

### Changed
- Show pending edit upload status for photos and traces [`#186`](https://github.com/developmentseed/observe/pull/186)

### Added
- Store uploadedAt timestamp for traces and photos [`#184`](https://github.com/developmentseed/observe/pull/184)

### Fixed
- Make photo list sort consistent [`#185`](https://github.com/developmentseed/observe/pull/185)


## [v0.2.1] - 2020-02-14

### Changed
- Check if offline when deciding whether to show preauth prompt [`#165`](https://github.com/developmentseed/observe/pull/165)
- Revise ios version script to use agvtool, keep android version code in sync with ios build version [`#169`](https://github.com/developmentseed/observe/pull/169)
- Add [`170`](https://github.com/developmentseed/observe/pull/170) and revert [`176`](https://github.com/developmentseed/observe/pull/176) nodecache functionality
- Set threshold for user location updates and turn off animations [`#180`](https://github.com/developmentseed/observe/pull/180)

### Added
- Add babel-plugin-transform-remove-console [`#179`](https://github.com/developmentseed/observe/pull/179)

### Fixed
- Update download instructions in the readme [`#162`](https://github.com/developmentseed/observe/pull/162)

## [v0.2.0-alpha] - 2020-01-14

### Changed
- Revise documentation [`#152`](https://github.com/developmentseed/observe/pull/152)
- Update @react-native-mapbox-gl/maps to ^7.0.8 [`#133`](https://github.com/developmentseed/observe/pull/133)
- Remove all pods from git [`#130`](https://github.com/developmentseed/observe/pull/130)
- Improve preath & location access flow [`#122`](https://github.com/developmentseed/observe/pull/122)
- Rename services/api.js to services/osm-api.js [`#117`](https://github.com/developmentseed/observe/pull/117)
- Ask user to log in if preauth url exists [`#112`](https://github.com/developmentseed/observe/pull/112)
- Map layer switcher [`#111`](https://github.com/developmentseed/observe/pull/111)
- react-native 0.61.1 upgrade [`#98`](https://github.com/developmentseed/observe/pull/98)

### Added
- Observe API service [`#119`](https://github.com/developmentseed/observe/pull/119)
- Integrate photo api [`#150`](https://github.com/developmentseed/observe/pull/150)
- Add observe api auth to accounts screen [`#142`](https://github.com/developmentseed/observe/pull/142)
- Add photos to a feature [`#136`](https://github.com/developmentseed/observe/pull/136)
- Login to Observe API [`#116`](https://github.com/developmentseed/observe/pull/116)
- Show traces on the map [`#115`](https://github.com/developmentseed/observe/pull/115)
- Show gps track while recording [`#110`](https://github.com/developmentseed/observe/pull/110)
- Integrate expo-camera [`#103`](https://github.com/developmentseed/observe/pull/103)
- More API tests [`#83`](https://github.com/developmentseed/observe/pull/83)
- More util tests [`#82`](https://github.com/developmentseed/observe/pull/82)
- Edit workflow tests [`#80`](https://github.com/developmentseed/observe/pull/80)
- Test edit utils [`#81`](https://github.com/developmentseed/observe/pull/81)
- Photos list screen [`#105`](https://github.com/developmentseed/observe/pull/105)
- Trace actions and reducers [`#104`](https://github.com/developmentseed/observe/pull/104)

### Fixed
- Fix map maxzoom so tiles don't go black [`#157`](https://github.com/developmentseed/observe/pull/157)
- Make android accept strings in version [`#156`](https://github.com/developmentseed/observe/pull/156)
- Clear search text on blur [`#127`](https://github.com/developmentseed/observe/pull/127)
- Scroll the screen to avoid keyboard overlapping input fields [`#123`](https://github.com/developmentseed/observe/pull/123)
- Hide upload and trash buttons if there are no edits [`#124`](https://github.com/developmentseed/observe/pull/124)
- Fix field collapse in add/edit feature panel [`#120`](https://github.com/developmentseed/observe/pull/120)
- Use proper asset url for ios and android [`#76`](https://github.com/developmentseed/observe/pull/76)

## [v0.1.8] - 2019-06-29

### Changed
- Update packages with high-level security updates needed ([pull request](https://github.com/developmentseed/observe/pull/38))
- Update react-native and @react-native-mapbox-gl/maps  ([pull request](https://github.com/developmentseed/observe/pull/47))
- Use [ObserveIcon font](https://github.com/developmentseed/observe-icon-font) in place of png files in ui ([pull request](https://github.com/developmentseed/observe/pull/59))
- Use a `getPresetByTags` function for matching a feature's tags to a preset ([pull request](https://github.com/developmentseed/observe/pull/59))
- Update global text and field styles to better match mockups ([pull request](https://github.com/developmentseed/observe/pull/58))

### Added
- Add more starter presets and set a clear search placeholder ([pull request](https://github.com/developmentseed/observe/pull/31))
- Add empty state for Your Contributions screen ([pull request](https://github.com/developmentseed/observe/pull/69))

### Fixed
- Fixed coordinate spread bug ([pull request](https://github.com/developmentseed/observe/pull/70))
- Guard against failed file unlink ([pull request](https://github.com/developmentseed/observe/pull/50))

## [v0.1.7] - 2019-05-13

### Added
- First public release

[Unreleased]: https://github.com/developmentseed/observe/compare/v0.2.1...HEAD
[v0.2.1]: https://github.com/developmentseed/observe/compare/v0.2.0-alpha...v0.2.1
[v0.2.0-alpha]: https://github.com/developmentseed/observe/compare/v0.1.8...v0.2.0-alpha
[v0.1.8]: https://github.com/developmentseed/observe/compare/v0.1.7...v0.1.8
[v0.1.7]: https://github.com/developmentseed/observe/compare/b7522e25f369fa9051e1b02cde40135ffacc755b...v0.1.7
