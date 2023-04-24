#!/bin/sh

npm run build
rm -r function-source.zip
cp ../package.json .././dist
cp ../package-lock.json .././dist
pushd ../dist
zip -r function-source.zip *