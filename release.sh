#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm test || exit 1

# checkout temp branch for release
git checkout -b gh-release

# create built library (and versioned copy)
grunt version

# force add file
git add terraformer.min.js -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push https://github.com/Esri/terraformer gh-release

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-$VERSION.min.js

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D gh-release
git push https://github.com/Esri/terraformer :gh-release

# publish release on NPM
npm publish