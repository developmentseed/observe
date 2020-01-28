#!/usr/bin/env bash -e

# This script reads the version from package.json.
# It uses that as the ios marketing version and the android version name.
# For the ios build version and the ios android code, this script
# first increments the ios build version, then uses that as the next android version code.
# This keeps the versions matching across platforms.

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

cd ios
xcrun agvtool new-marketing-version $PACKAGE_VERSION
xcrun agvtool next-version
BUILD_VERSION=$(xcrun agvtool what-version -terse)
echo "VERSION_CODE=${BUILD_VERSION}" > ../android/app/version.properties
git add .
cd ..
