[![Build Status](https://travis-ci.org/AndiDittrich/sculpture.js.svg?branch=master)](https://travis-ci.org/AndiDittrich/sculpture.js)

sculpture.js
=========================================
yet another static website generator. Transforms **ejs** based templates to pages

## Features ##

* Generate full-static websites
* Parallel processing using ES6 promise/await
* Templates based on [ejs](http://ejs.co/)
* Plugin system to inject custom functions into templates

## Install ##

```bash
$ yarn global add sculpture.js
```

## Usage ##

Just run `sculpture update` within your current project directory. All `ejs` file within the `pages/` directory will be rendered and written to `dist/` directory. Thats it!

The generator should be invoked as final step **after** any task runners like grunt/gulp have been executed.

### Configuration File ###

Each project needs a json based configuration file within the root directory named `sculpture.json`

```json
{
    "globals": {
        "title": "Beyond Technology - beyond the visible world"
    },

    "resources": [
        "/bootstrap.min.css",
        "/about.min.css",
        "/util.min.js"
    ],

    "plugins": [
        "resources"
    ]
}
```

#### Keys ####

**globals**: global ejs variables accessible via `globals.<name>`

Example:

```html
<title><%= globals.title %></title>
```

**plugins**: plugin namespace of registered plugins `<%- plugins.<name>.<export> %>`

Example:

```html
<%- plugins.resources.enqueue('css'); %>
</head>
```

### Directory Structure ###

The following structure is currently **required**

```
> project
  |-- sculpture.json
  |-- dist
  |    |-- libraryA.js
  |    |-- frameworkB.min.css
  |-- pages
  |    |-- page1.ejs
  |    |-- page2.ejs
  |    |-- pageN.ejs
  |-- templates
  |    |-- header.ejs
  |    |-- footer.ejs
```

## Example ##

```terminal
 $ sculpture update
[config]      ~ sculpture configuration loaded 
[sculpture.js]~ generating static pages.. 
[generator]   ~ initializing plugins.. 
[plugins]     ~ loading plugin [ resources ] 
[resources]   ~ generating resource hashes.. 
[plugins]     ~ loading plugin [ moment ] 
[plugins]     ~ loading plugin [ cryptex ] 
[generator]   ~ processing 3 pages.. 
[ejs-renderer]~ rendering page [ contact.ejs ] 
[ejs-renderer]~ rendering page [ imprint.ejs ] 
[ejs-renderer]~ rendering page [ privacy-policy.ejs ] 
[sculpture.js]~ finished in 2 seconds 
```

## License ##
sculpture.js is OpenSource and licensed under the Terms of [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0) - your're welcome to contribute