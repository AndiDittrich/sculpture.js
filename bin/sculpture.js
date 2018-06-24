#!/usr/bin/env node
/*eslint no-process-exit: 0*/

// load utils
const _pkg = require('../package.json');
const _cli = require('commander');

// logging
const _loggingFacility = require('logging-facility');
const _logger = _loggingFacility.getLogger('sculpture.js');
_loggingFacility.addBackend('fancy-cli');

// libs
const _generator = require('../lib/generator');
const _config = require('../lib/config-reader');
const _cwd = process.cwd();

// wrap async tasks
function asyncWrapper(promise){
    return function(...args){
        // epassthrough
        promise(...args)

            // gracefull exit
            .then(() => {
                process.exit(0)
            })

            // handle low-level errors
            .catch(err => {
                _logger.error(err.message);
                _logger.debug(err.stack);
                process.exit(1);
            });
    }
}

// CLI setup
_cli
    // read file version package.json
    .version(_pkg.version);

// run generator
_cli
    .command('update')
    .description('generate static pages')
    .action(asyncWrapper(async () => {
        // start time
        const t0 = Date.now();

        // load config within current working dir
        const config = await _config.load(_cwd);

        // run generator
        _logger.log('generating static pages..');
        await _generator(config, _cwd);

        // stop time
        const t1 = Date.now();

        // msg
        _logger.log(`finished in ${Math.ceil((t1-t0)/1000)} seconds`);
    }));

// unknown
_cli
    .command('*')
    .action((cmd) => {
        _logger.error('Unknown command "' + cmd + '"');
        _cli.outputHelp();
        process.exit(1);
    });

// run the commander dispatcher
_cli.parse(process.argv);

// default action (no command provided)
if (!process.argv.slice(2).length) {
    _cli.outputHelp();
}