yarn expo export:web
yarn rimraf ./go/electron/output
yarn rimraf ./go/electron/prod/resources/app
mkdir ./go/electron/prod/resources/app
cp -r ./web-build/* ./go/electron/prod/resources/app
cd ./go/electron/prod
astilectron-bundler