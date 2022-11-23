npm run build
rm -r function-source.zip
zip -r function-source.zip dist
zip function-source.zip package.json
zip function-source.zip package-lock.json