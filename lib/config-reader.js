const _fs = require('fs-magic');
const _path = require('path');
const _loggingFacility = require('logging-facility');
const _logger = _loggingFacility.getLogger('config');

// load sculpture.json config located into current working dir
async function loadConfig(basedir){

    // config file within current working dir
    const filename = _path.join(basedir, 'sculpture.json');

    // file exists ?
    if (!(await _fs.isFile(filename))){
        throw new Error('cannot load config file - ' + filename);
    }

    // try to load project based configuration
    const rawData = await _fs.readFile(filename, 'utf8');

    // check length
    if (rawData.length < 2){
        throw new Error('empty config - ' + filename);
    }

    // decode json based data
    const config = JSON.parse(rawData);
    _logger.log('sculpture configuration loaded');

    return config;
}

module.exports = {
    load: loadConfig
};