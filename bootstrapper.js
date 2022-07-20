'use strict';

import { readFileSync } from 'fs';
import LMRSlotObject from './interpreter/LMRSlotObject.js';
import LMRByteObject from './interpreter/LMRByteObject.js';
import LMRSmallInteger from './interpreter/LMRSmallInteger.js';

const ObjectTypes = Object.freeze({
	LMRSlotObject: 1,
	LMRByteObject: 2,
	LMRSmallIntegerObject: 3
})

let Bootstrapper = class {
	load() {
		let rawdata = readFileSync('kernel.json');
		let kernel = JSON.parse(rawdata);
		this.objects = kernel[1].map(obj => recreate(obj));
		this.objects.forEach(obj => linkSlots(obj));
		this.exported = Object.fromEntries(Object.entries(kernel[0]).map( ([name, index]) => [name, this.objects[index]]));
		return this.objects;
	}

	recreate(object) {
		switch (object.type) {
			case ObjectTypes.LMRSlotObject:
				return new LMRSlotObject(object);
			case ObjectTypes.LMRByteObject:
				return new LMRByteObject(object);
			case ObjectTypes.LMRSmallIntegerObject:
				return new LMRSmallIntegerObject(object);
			default: 
				throw "unknown object type";
		}
	}

	newSlotObject(object)
	{
		let result = new LMRSlotObject();
		result.slots = object.slots;
		result.header = object.header;		
		return result;
	}

	newByteObject(object)
	{
		let result = new LMRSlotObject();
		result.bytes = object.bytes;
		result.header = object.header;		
		return result;
	}

	newSmallIntegerObject(object)
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

export default Bootstrapper

