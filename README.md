## hawtio-ui

[![Circle CI](https://circleci.com/gh/hawtio/hawtio-ui.svg?style=svg)](https://circleci.com/gh/hawtio/hawtio-ui)

This plugin contains a number of UI widgets and dependencies for hawtio 2.x projects.

For more information please take a look at the [live demo website](http://ui.hawt.io).

## Installation

```
yarn add @hawtio/ui
```

## Set up development environment

### Clone the repository

```
git clone https://github.com/hawtio/hawtio-ui
cd hawtio-ui
```

### Install development tools

* [Node.js](http://nodejs.org)
* [Yarn](https://yarnpkg.com)
* [gulp](http://gulpjs.com/)

### Install project dependencies

```
yarn install:dev
```

### Run the web application

```
gulp
```

### Change the default proxy port

To proxy to a local JVM running on a different port than `8282` specify the `--port` CLI arguement to gulp:
```
gulp --port=8181
```

#### Output build to a different directory

When developing this plugin in a dependent console you can change the output directory where the compiled .js and .css go.  Just use the 'out' flag to set a different output directory, for example:

```
gulp watch --out=../fabric8-console/libs/hawtio-ui/dist/
```

Whenever the build completes the compiled .js file will be put into the target directory.  Don't forget to first do a `gulp build` without this flag before committing changes!

### Working on the code

Have a look at the hawtio 2.x [overview document](https://github.com/hawtio/hawtio/blob/master/docs/Overview2dotX.md) under "Getting Started" specifically.
