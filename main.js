#!/usr/bin/env node

if (process.argv.length != 3)
	throw 'wrong arguments'

import LMR from './lmr.js';
import Bootstrapper from './bootstrapper.js';


var bootstrapper = new Bootstrapper().load();
var lmr = new LMR(bootstrapper);
var module = lmr.load(process.argv[2]);
module.main();
