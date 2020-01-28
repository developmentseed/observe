#!/usr/bin/env bash -e

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

cd ios
xcrun agvtool new-marketing-version $PACKAGE_VERSION
xcrun agvtool next-version
git add .
cd ..
