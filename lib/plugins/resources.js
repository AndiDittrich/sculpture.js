const _fs = require('fs-magic');
const _logger = require('logging-facility').getLogger('resources');
let _hashes = {};

// generate file hashes
async function generateHashes(basedir){

    _logger.log('generating resource hashes..');
    
    // get files
    const [files] = await _fs.scandir(basedir, true, true);

    // get hashes
    const fullHashes = await Promise.all(files.map(f => _fs.sha384file(f, 'base64')));

    // strip + minify
    const shortHashes = fullHashes.map(h => h.replace(/[^a-z0-9]/gi, '').substr(0, 12));

    // output map
    _hashes = {};

    for (let i=0;i<fullHashes.length;i++){
        // cannocial filename
        const filename = files[i].substr(basedir.length);
        _hashes[filename] = {
            tag: shortHashes[i],
            sri: 'sha384-' + fullHashes[i]
        };
    }
}

// get a single resource url including tag
function getUrl(localResourceName){
    // resource exists ?
    if (localResourceName in _hashes){
        return '/' + _hashes[localResourceName].tag + localResourceName;
    }else{
        return localResourceName;
    }
}

function enqueueResource(name){
    // get resource url
    const url = (name in _hashes) ? '/' + _hashes[name].tag + name : null;

    // external resources
    if (url===null){
        // dispatch
        if (name.endsWith('.js')){
            return `<script type="text/javascript" src="${name}"></script>`;
        }else if (name.endsWith('.css')){
            return `<link rel="stylesheet" type="text/css" href="${name}" />`;
        }

    // internal resources
    }else{
        // dispatch
        if (name.endsWith('.js')){
            return `<script type="text/javascript" src="${url}" integrity="${_hashes[name].sri}" crossorigin="anonymous"></script>`;
        }else if (name.endsWith('.css')){
            return `<link rel="stylesheet" type="text/css" href="${url}" integrity="${_hashes[name].sri}" />`;
        }
    }

    // no match
    return '';
}

// get js/css resources including subresource-integrity-hash
function getResources(...localResourceNames){
    // generate html elements
    return localResourceNames.map(name => {
        return enqueueResource(name);
    }).reduce((p, c) => p + c, '');
}

// generator
function enqueueResources(list){
    return function enqueue(type){
        // enqueue resoures of specific type
        return getResources(...list.filter(entry => entry.endsWith(type)));
    }
}

module.exports = async function init(config, workingDir, distDir){
    // calculate hashes
    await generateHashes(distDir);

    return {
        getUrl: getUrl,
        get: getResources,
        enqueue: enqueueResources(config.resources || [])
    };
};