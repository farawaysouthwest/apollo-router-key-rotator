#!/bin/sh

npm run build
rm -r function-source.zip
cp ../package.json .././dist
cp ../package-lock.json .././dist
zip -r -j function-source.zip ../dist