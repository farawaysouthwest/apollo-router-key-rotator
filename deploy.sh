npm run build
cp package.json ./dist
cp package-lock.json ./dist
gcloud functions deploy main-apollo-router-key-rotator --source=./dist