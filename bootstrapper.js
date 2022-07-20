'use strict';

//import PowertalkLMR from "./interpreter/PowertalkLMR.js";

import ModuleReader from "./ModuleReader.js"

let Bootstrapper = class {
	constructor()
	{
		this.modules = {};
//		this.runtime = new PowertalkLMR();
	}

	loadKernel(kernelPath = 'kernel.json')
	{
		this.kernel = this.loadModule(kernelPath);
		//Object.assign(this.runtime, this.kernel.meta);
		Object.assign(this.runtime, this.kernelMeta());
		Object.assign(this.runtime, this.kernelClasses());
	}

	loadModule(path)
	{
		const reader = new ModuleReader();
		return modules[path] = reader.loadFile(path);
	}

	kernelClasses()
	{
		return {
			falseObj: this.kernel.exports["false"],
			trueObj:  this.kernel.exports["true"],
			nilObj:   this.kernel.exports["nil"],
			arrayClass:        this.kernel.exports["Array"],
			metaclassClass:    this.kernel.exports["Metaclass"],
			methodClass:       this.kernel.exports["Method"],
			smallIntegerClass: this.kernel.exports["SmallInteger"],
			blockClass:        this.kernel.exports["CompiledBlock"],
			byteArrayClass:    this.kernel.exports["ByteArray"],
			stringClass:       this.kernel.exports["String"],
			closureClass:      this.kernel.exports["Closure"],
			behaviorClass:     this.kernel.exports["Behavior"]
		};
	}

// TODO:  (difficulty easy)
// this method should not exist, because the image segment should be self-descriptive.
// but that needs to be implemented, meanwhile we resort to hardcoded info
//
	kernelMeta () {
		return {
			wordSize: 8,
			behaviorNextIndex: 3,
			behaviorMethodDictionaryIndex: 2,
			behaviorClassIndex: 1,
			classNameIndex: 6,
			methodFlagsIndex: 1,
			maxSMI: 4611686018427387903,
			minSMI:-4611686018427387904,
			speciesInstanceBehaviorIndex: 2,
			speciesFormatIndex: 3,
			methodOptimizedCodeIndex: 2,
			methodAstcodesIndex: 3,
			methodInstSize: 6,
			methodClassBindingIndex: 4,
			speciesSuperclassIndex: 1,
			speciesIvarsIndex: 5,
			dictionaryTableIndex: 2,
			classClassVariablesIndex: 8,
			metaclassInstanceClassIndex: 6,
			classModuleIndex: 10,
			moduleNamespaceIndex: 4,
			closureBlockIndex: 1,
			blockMethodIndex: 3
		};
	}
}

export default Bootstrapper

