#!/usr/bin/env bash -e

# Use this script to create a new build version.
# This is mostly useful for creating incremental/alpha/beta builds.
# To create a new release, use `npm version {version}`

# This script reads the version from package.json.
# It uses that as the ios marketing version and the android version name.
# For the ios build version and the ios android code, this script
# first increments the ios build version, then uses that as the next android version code.
# This keeps the versions matching across platforms.

cd ios
xcrun agvtool next-version
BUILD_VERSION=$(xcrun agvtool what-version -terse)
echo "VERSION_CODE=${BUILD_VERSION}" > ../android/app/version.properties
git add .
cd ..
