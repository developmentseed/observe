#!/bin/bash

# Script to download new icons from Maki, Temaki, and Fontawesome and update Observe

echo 'Clone maki'
git clone https://github.com/mapbox/maki.git /tmp/maki

APP_PATH=$PWD
convert_svg_to_png=$PWD/node_modules/.bin/convert-svg-to-png

cd /tmp/maki/icons

echo 'Making the svgs white'
find . -name '*-11.svg' | xargs sed -i -e "s/<path /<path fill='#FFF' /"

echo 'Convert svgs to 64x64 png'
find . -name '*-11.svg' | xargs -n 1 basename |
while read file; do
  filename="maki-${file%-11.svg}.png"
  filename=${filename//-/_}
  cat $file | $convert_svg_to_png --height 64 --width 64 --filename $filename
done

echo 'Clone temaki'
git clone https://github.com/ideditor/temaki.git /tmp/temaki
cd /tmp/temaki/icons

echo 'Making the svgs white'
find . -name '*.svg' | xargs sed -i -e "s/<path /<path fill='#FFF' /"

echo 'Convert svgs to pngs'

find . -name '*.svg' | xargs -n 1 basename |
while read file; do
  filename="temaki-${file%.svg}.png"
  filename=${filename//-/_}
  cat $file | $convert_svg_to_png --height 64 --width 64 --filename $filename
done

echo 'Prepare fontawesome'
git clone --depth=1 https://github.com/openstreetmap/iD.git /tmp/id
cd /tmp/iD/svg/fontawesome

echo 'Make fontawesome icons while'
find . -name '*.svg' | xargs sed -i -e "s/<path /<path fill='#FFF' /"

echo 'Convert svgs to 64x64 png'
find . -name '*.svg' | xargs -n 1 basename |
while read file; do
  filename="${file%.svg}.png"
  filename=${filename//-/_}
  cat $file | $convert_svg_to_png --height 64 --width 64 --filename $filename
done

echo "Process iD sprites presets"
cd /tmp/iD/svg/iD-sprite/presets

echo 'Convert iD-sprites to 64x64 png'
find . -name '*.svg' | xargs -n 1 basename |
while read file; do

  # Get filaname with PNG extension
  filename="${file%.svg}.png"

  # Replace "-" with "_"
  filename=${filename//-/_}
  
  # Convert
  cat $file | $convert_svg_to_png --height 64 --width 64 --filename $filename

  # Move file to targe folder, adding "iD_" prefix
  mv $filename iD_$filename
done

echo 'Copy icons to Observe...'

mkdir -p /tmp/maki_observe
cp /tmp/maki/icons/*.png /tmp/maki_observe
rm -rf app/assets/maki
mv /tmp/maki_observe app/assets/maki

mkdir -p /tmp/temaki_observe  
cp /tmp/temaki/icons/*.png /tmp/temaki_observe
rm -rf app/assets/temaki
mv /tmp/temaki_observe app/assets/temaki

mkdir -p /tmp/fas_observe
cp /tmp/iD/svg/fontawesome/*.png /tmp/fas_observe
rm -rf app/assets/fontawesome
mv /tmp/fas_observe app/assets/fontawesome

mkdir -p /tmp/id_presets_observe
cp /tmp/iD/svg/iD-sprite/presets/*.png /tmp/id_presets_observe
rm -rf $APP_PATH/app/assets/id_presets
mv /tmp/id_presets_observe $APP_PATH/app/assets/id_presets

rm -rf /tmp/maki_observe
rm -rf /tmp/temaki_observe
rm -rf /tmp/fas_observe
rm -rf /tmp/id_presets_observe
rm -rf /tmp/maki
rm -rf /tmp/temaki
rm -rf /tmp/iD

# update links
. scripts/link-icons.sh