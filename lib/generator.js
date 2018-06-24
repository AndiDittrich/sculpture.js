const _ejs = require('./ejs-engine');
const _path = require('path');
const _fs = require('fs-magic');
const _logger = require('logging-facility').getLogger('generator');
const _plugins = require('./plugin-loader');

// page generator entry point
async function run(config, workingDir){

    // template + output dirs
    const pageDir = _path.join(workingDir, 'pages');
    const distDir = _path.join(workingDir, 'dist');

    // get pages
    const [pages] = await _fs.scandir(pageDir, false, true);

    // load plugins and register them within main renderer
    _logger.log('initializing plugins..');
    _ejs.registerPlugins(await _plugins.load(config, workingDir, distDir));

    // pages
    _logger.log(`processing ${pages.length} pages..`);

    // parallel rendering
    return Promise.all(pages.map(async function(page){

        // trigger EJS renderer
        const content = await _ejs.render(page, workingDir, config);

        // generate output filename
        const outputFilename = _path.join(distDir, _path.basename(page, '.ejs') + '.html');

        // store file as page
        return _fs.writeFile(outputFilename, content, 'utf8');
    }));

}

module.exports = run;