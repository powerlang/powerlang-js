
import LMRObjectHeader from './interpreter/LMRObjectHeader.js';
import LMRSlotObject from './interpreter/LMRSlotObject.js';
import LMRByteObject from './interpreter/LMRByteObject.js';
import LMRSmallInteger from './interpreter/LMRSmallInteger.js';

import { readFileSync } from 'fs';

export const ObjectTypes = Object.freeze({
	LMRSlotObject: 1,
	LMRByteObject: 2,
	LMRSmallIntegerObject: 3,
	Import: 4
})

const ModuleReader = class {
    constructor(environment = {})
    {
        this.environment = environment;
    }

   	loadFile(path) {
		let rawdata = readFileSync(path);
		let module = JSON.parse(rawdata);
		loadObjects(module);
	}

	loadObjects(module) {
		this.objects = module.objects.map(obj => this.recreate(obj));
		this.objects.forEach(obj => this.linkSlots(obj));
		this.exports = Object.fromEntries(Object.entries(module.exports).map( ([name, index]) => [name, this.objects[index]]));
		return this.objects;
	}

	objectNamed(name)
	{
	  return this.exports[name];
	}

	recreate(object) {
		switch (object.type) {
			case ObjectTypes.LMRSlotObject:
				return this.newSlotObject(object);
			case ObjectTypes.LMRByteObject:
				return this.newByteObject(object);
			case ObjectTypes.LMRSmallIntegerObject:
				return this.newSmallInteger(object);
            case ObjectTypes.Import:
                return this.environment[object.name];
			default: 
				throw "unknown object type";
		}
	}

	newSlotObject(object)
	{
		let result = new LMRSlotObject();
		result.slots = object.slots;
		result.header = new LMRObjectHeader();
		result.header.behavior = object.behavior;		
		result.header.hash = object.hash;
		return result;
	}

	newByteObject(object)
	{
		let result = new LMRByteObject();
		result.bytes = object.bytes;
		result.header = new LMRObjectHeader();
		result.header.behavior = object.behavior;		
		result.header.hash = object.hash;
		return result;
	}

	newSmallInteger(object)
	{
		let result = new LMRSmallInteger();
		result.value = object.value;
		return result;
	}
	
	linkSlots(object) {
		if (object.isImmediate())
			return;
		
		object.header.behavior = this.objects[object.header.behavior];
		
		if (!object.isBytes())
			object.slots = object.slots.map(index => this.objects[index]);
	}
}

export default ModuleReader
