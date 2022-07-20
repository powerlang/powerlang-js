#!/usr/bin/env node

if (process.argv.length != 3)
	throw 'wrong arguments'

import LMR from './lmr.js';
import Bootstrapper from './bootstrapper.js';


var bootstrapper = new Bootstrapper();
bootstrapper.loadKernel();
module = bootstrapper.loadModule(process.argv[2]);

bootstrapper.run(module.main);
