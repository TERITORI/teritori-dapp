#!/bin/bash

bash ./weshd.sh
npx expo prebuild --clean
ruby add_frameworks.rb
npx expo run:ios
