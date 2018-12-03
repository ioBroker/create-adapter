"use strict";
const templateFunction = (answers) => {
    const isAdapter = answers.features.indexOf("Adapter") > -1;
    if (!isAdapter)
        return;
    const template = `
os:
  - linux
  - osx
  - windows

language: node_js
node_js:
  - '6'
  - '8'
  - '10'

env:
  - CXX=g++-4.8
addons:
  apt:
    sources:
      - ubuntu-toolchain-r-test
    packages:
      - g++-4.9

before_install:
  - 'if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then CC=gcc-4.9; fi'
  - 'if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then CC=g++-4.9; fi'
before_script:
  - export NPMVERSION=$(echo "$($(which npm) -v)"|cut -c1)
  - 'if [[ $NPMVERSION == 5 ]]; then npm install -g npm; fi'
  - npm -v
  - npm install winston@2.3.1
  - 'npm install https://github.com/ioBroker/ioBroker.js-controller/tarball/master --production'
script:
  - npm run test:package
  - npm run test:iobroker
`;
    return template.trim();
};
templateFunction.customPath = ".travis.yml";
// .travis.yml is always formatted with 2 spaces
templateFunction.noReformat = true;
module.exports = templateFunction;
