import { readFile, TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;
	// We drop Node 6 from the test matrix if we are using object spreads
	const isJSWithES6Class = answers.language === "JavaScript" && answers.es6class === "yes";

	const template = `
os:
  - linux
  - osx
  - windows

language: node_js
node_js:
${isJSWithES6Class ? "" : `  - '6'
`}  - '8'
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
script:
  - npm run test:package
  - npm run test:unit
  - npm run test:integration
`;
	return template.trimLeft();
};

templateFunction.customPath = ".travis.yml";
// .travis.yml is always formatted with 2 spaces
templateFunction.noReformat = true;
export = templateFunction;
