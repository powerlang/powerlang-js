'use strict';

const fs = require('fs');
const LMRSlotObject = require './interpreter/LMRSlotObject.js';
const LMRByteObject = require './interpreter/LMRByteObject.js';
const LMRSmallInteger = require './interpreter/LMRSmallInteger.js';

let Bootstrapper = class {
	load() {
		let rawdata = fs.readFileSync('kernel.json');
		let kernel = JSON.parse(rawdata);
		this.objects = kernel[1].map(obj => recreate(obj));
		this.objects.forEach(obj => linkSlots(obj));
		this.exported = Object.fromEntries(Object.entries(kernel[0]).map( ([name, index]) => [name, this.objects[index]]);
		return this.objects;
	}

	recreate(object) {
		if (object.type == "LMRSlotObject")
			return new LMRSlotObject(object);
		if (object.type == "LMRByteObject")
			return new LMRByteObject(object);
		if (object.type == "LMRSmallIntegerObject")
			return new LMRSmallIntegerObject(object);
		throw "unknown object type";
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

module.exports = Bootstrapper

