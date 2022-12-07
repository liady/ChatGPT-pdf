#!/bin/sh
cd src

VERSION=$(cat manifest.json | grep '"version":' | cut -d '"' -f 4)
echo "Building version $VERSION"

# build chrome
zip -r chrome-chatgpt-share-v${VERSION}.zip .

# replace manifest version from 3 to 2
sed -i 's/"manifest_version": 3/"manifest_version": 2/g' manifest.json

# build firefox
zip -r firefox-chatgpt-share-v${VERSION}.zip .

# restore manifest version from 2 to 3
sed -i 's/"manifest_version": 2/"manifest_version": 3/g' manifest.json

# move to distq
mkdir -p ../dist/v${VERSION}
mv chrome-chatgpt-share-v${VERSION}.zip ../dist/v${VERSION}/chrome-chatgpt-share-v${VERSION}.zip
mv firefox-chatgpt-share-v${VERSION}.zip ../dist/v${VERSION}/firefox-chatgpt-share-v${VERSION}.zip

cd ..