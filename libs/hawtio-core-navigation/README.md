## hawtio-core-navigation

A core plugin that provides the main navigation bar and an API to manipulate the navigation bar for the **[hawtio](http://hawt.io)** web console.

### Basic usage
* `bower install --save hawtio-core-navigation`

* In your hawtio plugin you can configure your routes and the navigation bar in one go:

```
  var tab = undefined;
  var module = angular.module("MyAwesomePlugin", []);

  // configure our tabs and routing
  module.config(['$routeProvider', 'HawtioNavBuilderProvider', function($routeProvider, builder) {
    tab = builder.create()
            .id("MyTab")
            .title(function () { return "Hello"; })
            .href(function () { return "/test1"l })
            .subPath("World!", "page1", "partials/page1.html")
            .build();
    builder.configureRouting($routeProvider, tab);
  }]);

  // add our tabs to the nav bar
  module.run(["HawtioNav", function(HawtioNav) {
    HawtioNav.add(tab);
  }]);

  hawtioPluginLoader.addModule("MyAwesomePlugin");
```

* You can also configure your routes separately for more control and configure the tabs in your module's run method:

```
  var module = angular.module("MyAwesomePlugin", []);
  // configure routing...
  module.config(['$routeProvider', function($routeProvider) {
    /// snip
  }]);

  module.run(["HawtioNav", function(HawtioNav) {
    // get a builder object to create nav objects
    var builder = HawtioNav.builder();

    // Create a subtab
    var subTab = builder.id('fooSubTab')
                        .href(function() { return '/foo/bar'; })
                        .title(function() { return 'My Sub Tab'; })
                        .build();

    // Create a top-level tab
    var tab = builder.id('foo')
                     .href(function() { return '/foo'; })
                     .isValid(function() { return true; })
                     .title(function() { return 'My Tab'; })
                     .tabs(subTab);
                     .build();

    // Add to the nav bar
    HawtioNav.add(tab);
  }]);
```

see [index.html](https://github.com/hawtio/hawtio-core-navigation/blob/master/index.html) and [hawtio-nav-example.js](https://github.com/hawtio/hawtio-core-navigation/blob/master/hawtio-nav-example.js) for more detail.
