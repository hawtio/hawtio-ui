## hawtio-ui [![Circle CI](https://circleci.com/gh/hawtio/hawtio-ui.svg?style=svg)](https://circleci.com/gh/hawtio/hawtio-ui)

This plugin contains a number of UI widgets and dependencies for hawtio 2.x projects.

For more information please take a look at the [live demo website](http://ui.hawt.io).

#### Output build to a different directory

When developing this plugin in a dependent console you can change the output directory where the compiled .js and .css go.  Just use the 'out' flag to set a different output directory, for example:

`gulp watch --out=../fabric8-console/libs/hawtio-ui/dist/`

Whenever the build completes the compiled .js file will be put into the target directory.  Don't forget to first do a `gulp build` without this flag before committing changes!

### Working on the code

Have a look at the hawtio 2.x [overview document](https://github.com/hawtio/hawtio/blob/master/docs/Overview2dotX.md) under "Getting Started" specifically.
