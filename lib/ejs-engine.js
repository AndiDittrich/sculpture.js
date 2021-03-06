const _ejs = require('ejs');
const _fs = require('fs-magic');
const _path = require('path');
const _logger = require('logging-facility').getLogger('ejs-renderer');
let _plugins = {};

// register plugins
function registerPlugins(plugins){
    _plugins = plugins;
}

// custom ejs render function
async function render(view, viewBasePath, config){

    // valid view path ?
    if (!(await _fs.isDirectory(viewBasePath))){
        throw new Error('view base path is not a directory - ' + viewBasePath);
    }

    // ejs options
    const ejsOptions = {
        root: viewBasePath,
        strict: false,
        localsName: 'view'
    };

    // promise wrapper for ejs
    return new Promise(function(resolve, reject){

        // additional global objects within ejs template
        const payload = {};

        // global vars
        payload.globals = config.globals;

        // plugins
        payload.plugins = _plugins;

        // utility
        payload.isPage = function(name){
            return _path.basename(view, '.ejs') === name;
        }

        // status message
        _logger.log(`rendering page [ ${_path.basename(view)} ]`);

        // render ejs file
        _ejs.renderFile(view, payload, ejsOptions, (err, html) => {
            if (err){
                reject(err);
            }else{
                resolve(html);
            }
        });
    });
}

module.exports = {
    render: render,
    registerPlugins: registerPlugins
};