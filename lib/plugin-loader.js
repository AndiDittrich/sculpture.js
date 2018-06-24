const _logger = require('logging-facility').getLogger('plugins');

/*eslint global-require: 0*/
async function load(config, workingDir, distDir){

    // get plugin list
    const pluginList = config.plugins || [];

    // plugins found ?
    if (pluginList.length === 0){
        _logger.notice('no plugins requested');
    }

    // load + initialize plugin parallel
    const plugins = await Promise.all(pluginList.map(name => {
        _logger.log(`loading plugin [ ${name} ]`);

        // load plugin
        const p = require('./plugins/' + name);

        // call init
        return p(config, workingDir, distDir);
    }));

    const pluginExports = {};

    // merge plugin names + exports
    for (const index in pluginList){
        pluginExports[pluginList[index]] = plugins[index];
    }

    return pluginExports;
}

module.exports = {
    load: load
};