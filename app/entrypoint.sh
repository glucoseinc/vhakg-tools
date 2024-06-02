#! /bin/bash

cd /app
echo "Building the app"
yarn
yarn build
chmod +r /app/build/
echo "App built successfully"