# Observe change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [v1.0.0] - 2020-06-10

Observe v1.0.0 brings the ability to edit ways (lines and polygons) in the mobile app.

### Changed
- Replace point, trace, and photo buttons with a megamenu component [`#196`](https://github.com/developmentseed/observe/pull/196)
- Improve styles for ways and selected features [`#216`](https://github.com/developmentseed/observe/pull/216), [`#226`](https://github.com/developmentseed/observe/pull/226), [`#261`](https://github.com/developmentseed/observe/pull/261), [`#272`](https://github.com/developmentseed/observe/pull/272), [`#283`](https://github.com/developmentseed/observe/pull/283), [`#295`](https://github.com/developmentseed/observe/pull/295)
- Change "View Feature Detail" screen title [`#284`](https://github.com/developmentseed/observe/pull/284)

### Added
- Update presets in app to support ways [`#193`](https://github.com/developmentseed/observe/pull/193)
- Add started presets for ways [`#220`](https://github.com/developmentseed/observe/pull/220)
- Way editing overlay with buttons for editing nodes in a way [`#198`](https://github.com/developmentseed/observe/pull/198)
- Nodecache eviction [`#204`](https://github.com/developmentseed/observe/pull/204)
- Support ways on select preset screen [`#207`](https://github.com/developmentseed/observe/pull/207)
- Add util fo find nearest lines, edges, and nodes [`#209`](https://github.com/developmentseed/observe/pull/209)
- Add field inputs for ways [`#215`](https://github.com/developmentseed/observe/pull/215)
- Add nodes to existing ways [`#217`](https://github.com/developmentseed/observe/pull/217)
- Warn the user if they've selected a way in a relation [`#221`](https://github.com/developmentseed/observe/pull/221)
- Track in state the nodes in ways that are added, moved, or deleted [`#223`](https://github.com/developmentseed/observe/pull/223)
- State management for editing existing ways [`#224`](https://github.com/developmentseed/observe/pull/224)
- Change GeoJSON geometry when tag suggests area feature [`#227`](https://github.com/developmentseed/observe/pull/227)
- Render more types of features on the map [`#231`](https://github.com/developmentseed/observe/pull/231)
- Create changesets for complex way edits [`#232`](https://github.com/developmentseed/observe/pull/232)
- Handle pending node dependencies [`#282`](https://github.com/developmentseed/observe/pull/282)
- Set style of Way Editing Overlay on edit/selection [`#262`](https://github.com/developmentseed/observe/pull/262)
- Do not fetch nodes from cache when selecting ways [`#265`](https://github.com/developmentseed/observe/pull/265)
- Do not allow overwriting conflicting way geometries [`#299`](https://github.com/developmentseed/observe/pull/299)
- Update observe icons [`#300`](https://github.com/developmentseed/observe/pull/300)
- Keep polygons closed [`#302`](https://github.com/developmentseed/observe/pull/302)
- Hide deleted nodes [`#303`](https://github.com/developmentseed/observe/pull/303)
- Delete nodeless ways [`#309`](https://github.com/developmentseed/observe/pull/309)
- Show deleted ways [`#310`](https://github.com/developmentseed/observe/pull/310)
- Clear way after edit [`#308`](https://github.com/developmentseed/observe/pull/308)
- Dont allow adding stray nodes in edit way mode [`#316`](https://github.com/developmentseed/observe/pull/316)

### Fixed
- Fix preset icons [`#230`](https://github.com/developmentseed/observe/pull/230)
- Fix logic for determining preset of a feature [`#237`](https://github.com/developmentseed/observe/pull/237)
- Do not reset map view on enter "Edit Way" mode [`#247`](https://github.com/developmentseed/observe/pull/247)
- Edit geometry of a point [`#248`](https://github.com/developmentseed/observe/pull/248)
- Fix map overlay list [`#254`](https://github.com/developmentseed/observe/pull/254)
- Fix crosshair position while tracing gpx and editing features [`#280`](https://github.com/developmentseed/observe/pull/280)
- Fix changeset comment dialog [`#268`](https://github.com/developmentseed/observe/pull/268)
- Flag invalid lines and polygons and delete them [`#317`](https://github.com/developmentseed/observe/pull/317)
- Move opening/closing nodes of a polygon together, turn movedNode string into array if needed [`#287`](https://github.com/developmentseed/observe/pull/287)
- Fix delete nodes [`#290`](https://github.com/developmentseed/observe/pull/290)
- Allow editing ways that are pending upload [`#294`](https://github.com/developmentseed/observe/pull/294)
- Fix Edit Geometry button [`#298`](https://github.com/developmentseed/observe/pull/298)
- Update invalid trace message [#313](https://github.com/developmentseed/observe/pull/313)
- Fix overlap preview text [#314](https://github.com/developmentseed/observe/pull/314)
- Fix Observe logo header in nav drawer [#315](https://github.com/developmentseed/observe/pull/315)

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

[Unreleased]: https://github.com/developmentseed/observe/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/developmentseed/observe/compare/v0.2.2...v1.0.0
[v0.2.2]: https://github.com/developmentseed/observe/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/developmentseed/observe/compare/v0.2.0-alpha...v0.2.1
[v0.2.0-alpha]: https://github.com/developmentseed/observe/compare/v0.1.8...v0.2.0-alpha
[v0.1.8]: https://github.com/developmentseed/observe/compare/v0.1.7...v0.1.8
[v0.1.7]: https://github.com/developmentseed/observe/compare/b7522e25f369fa9051e1b02cde40135ffacc755b...v0.1.7
