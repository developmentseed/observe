#!/usr/bin/env bash

ASSETS_DIR=${PWD}/app/assets
IOS_DIR=${PWD}/ios/Observe/Images.xcassets
ANDROID_DIR=${PWD}/android/app/src/main/res/drawable-xxhdpi

ICON_DIRS="${ASSETS_DIR}/fontawesome/*.png
${ASSETS_DIR}/maki/*.png
${ASSETS_DIR}/temaki/*.png"

for file in $ICON_DIRS
do
  echo "Linking $file"

  # android
  ln -s $file $ANDROID_DIR

  # ios
  FILENAME=`basename $file`
  IMAGESET_DIRNAME=`basename $file .png`
  IMAGESET_PATH=${IOS_DIR}/${IMAGESET_DIRNAME}.imageset
  CONTENTS_FILEPATH=${IMAGESET_PATH}/Contents.json

  mkdir $IMAGESET_PATH
  node ./scripts/create-ios-icon-contents.js $CONTENTS_FILEPATH $FILENAME
  ln -s $file $IMAGESET_PATH
done
