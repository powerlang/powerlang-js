#!/usr/bin/env node

if (process.argv.length != 3)
	throw 'wrong arguments'

LMR    = require './lmr.js';
Bootstrapper = require './bootstrapper.js';


bootstrapper = new Bootstrapper().load();
lmr = new LMR(bootstrapper);
module = lmr.load(process.argv[2]);
module.main();
