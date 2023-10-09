yarn cross-env isElectron=prod expo export:web
yarn rimraf ./electron/prod/*
mkdir ./electron/prod/resources
mkdir ./electron/prod/resources/app
cp -r ./go/electron/prod/ ./electron/prod
cp -r ./go/electron/resources/* ./electron/prod/resources
cp -r ./web-build/* ./electron/prod/resources/app
cd ./electron/prod
astilectron-bundler 