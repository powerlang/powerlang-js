
// here we define a few base objects/classes/methods that we are going to add to the js environment
// for our smalltalk VM.

// The code of VM itself is transpiled to native JS, so VM's true is JS true, VM numbers are JS numbers.
// On the other hand, the Smalltalk image to be loaded has a true object that is a JS object (diferent from
// true), same for false, etc. 



// Support for transpiling Smalltalk cascades in VM code:
// JS doesn't support Smalltalk cascades directly. Our transliterator uses this _cascade function
// instead, generating code for evaluating the receiver with a closure that executes all the messages
// with that receiver. 
globalThis._cascade = function(receiver, cascadeStatements) { return cascadeStatements(receiver);}


// Support for nil in VM code:
// Unfortunately it is not possible to extend JS null with methods, so we define an object for nil
// and try to avoid using null anywhere

globalThis.nil = {}

Object.prototype.ifNil_ = function(closure) { if (this == nil) { return closure() } else { return nil } }

Object.prototype.ifNotNil_ = function(closure) { if (this == nil) { return nil } else {return closure(this)} }

Object.prototype.isNil = function() { return (this === nil) }
Object.prototype.notNil = function() { return (!this.isNil()) }

Object.prototype.initialize = function() { return this;}
Object.prototype.new = function() { const obj = new this; obj.initialize(); return obj; }


// add some Smalltalk-ish methods to JS booleans

Boolean.prototype.ifTrue_  = function(closure) { if (this == true) { return closure() } else {return nil } }
Boolean.prototype.ifFalse_ = function(closure) { if (this == true) { return nil } else { return closure() } }
Boolean.prototype.ifTrueIfFalse_ = function(closureTrue, closureFalse) { if (this == true) { return closureTrue() } else {return closureFalse() } }

Boolean.prototype._or  = function (b) { return this || b }
Boolean.prototype._and = function (b) { return this && b }

Array.new_ = function(size) { return new Array(size); }
Array.newWithAll_ = function(size, value) { return Array(size).fill(value); }
Array.prototype.size  = function()         { return this.length; }
Array.prototype.isEmpty  = function()         { return this.length == 0; }
Array.prototype.at_    = function(index)         { return this[index-1]; }
Array.prototype.atPut_ = function(index, object) { return this[index-1] = object; }
Array.prototype.allButLast = function() { return this.slice(0,-1); }
Array.prototype.asString = function() { return String.fromCharCode.apply(null, this); }
Array.prototype.do_ = function(closure) {
	this.forEach((value) => closure(value));
}


Array.prototype._comma = function(array) { return this.concat(array); }
Array.prototype._equal = function(value) { 
	return Array.isArray(value) &&
        this.length === value.length &&
        this.every((val, index) => val === value[index]);
}

String.prototype.asByteArray = function() { return Array.from(this).map((char) => char.charCodeAt(0)); }

Map.withAll_ = function(associations) {
	const result = new this;
	associations.forEach((assoc) => result.set(assoc.key(), assoc.value()));
	return result;
}

Map.prototype.at_          = function(key)         { return this.get(key); }
Map.prototype.atPut_       = function(key, value) { return this.set(key, value); }
Map.prototype.atIfPresent_ = function(key, closure) {
	if (this.has(key))
		return closure(this.get(key));
	else
		return nil;
}

//Map.prototype.atIfAbsentPut = function(key, closure) {
//	return this[key] ?? (this[key] = closure());
//}

Map.prototype.removeKeyIfAbsent_ = function(key, closure) {
	if (!this.delete(key)) { closure();}
}

Map.prototype.keysAndValuesDo_ = function(closure) {
	this.forEach((value, key) => closure(key, value));
}
// loop helpers
Function.prototype.whileTrue_ = function (block) {
	while(this()) { block() }
	return nil;
}

Function.prototype.whileFalse_ = function (block) {
	while(!this()) { block() }
	return nil;
}

Object.prototype._arrow = function(value) {
	const t = this;
	return {
		key: function() {return t; },
		value: function() {return value; },
		key_: function(k) {this.key = function() { return k; }; return this;},
		value_: function(v) {this.value = function() { return v; }; return this;}
	};
}

Object.prototype._equal = function(value) { return this ==  value; }
Object.prototype._notEqual = function(value) { return this !=  value; }
Object.prototype._equalEqual = function(value) { return this ===  value; }

// add some Smalltalk-ish methods to JS numbers
Number.prototype._lessEqualThan = function(value) { return this <=  value; }
Number.prototype._lessThan = function(value) { return this <  value; }
Number.prototype._greaterEqualThan = function(value) { return this >=  value; }
Number.prototype._greaterThan = function(value) { return this >  value; }

Number.prototype._plus = function(value) { return this + value; }
Number.prototype._minus = function(value) { return this - value; }
Number.prototype._times = function(value) { return this * value; }
Number.prototype._slash = function(value) { return this / value; }
Number.prototype._modulo = function(value) { return this % value; }
Number.prototype._integerQuotient = function(value) { return Math.floor(this / value); }
Number.prototype._and = function(value) { return this & value; }
Number.prototype._or = function(value) { return this | value; }
Number.prototype._shiftLeft = function(value) { return this << value; }
Number.prototype._shiftRight = function(value) { return this >> value; }


Number.prototype.timesRepeat_ = function(closure) { for (let i = 0; i < this; i++) { closure(); } }
Number.prototype.toDo_ = function(limit, closure) { for (let i = this; i <= limit; i++) { closure(i); } }
Number.prototype.toByDo_ = function(limit, increment, closure) { 
	if (increment > 0) 
		for (let i = this; i <= limit; i=i+increment) { closure(i); }
	else
		for (let i = this; i >= limit; i=i+increment) { closure(i); }
}


import LMRByteObject from "./interpreter/LMRByteObject.js";
import LMRSlotObject from "./interpreter/LMRSlotObject.js";

LMRSlotObject.prototype.pointersSize = function() { return this.size(); }
LMRSlotObject.prototype.size = function() { return this._slots.length; }
LMRByteObject.prototype.size = function() { return this._bytes.length; }

let Stretch = class {
	constructor(start, end) {this.start = start; this.end = end;};

	length() { return this.end - this.start + 1;}
}

Number.prototype.thru = function(value) { return new Stretch(this, value); }
Number.prototype.bitsAt_ = function(stretch) {
	let shifted = this >> (stretch.start - 1);
	let mask = 1 << stretch.length();
	return shifted & (mask - 1)
}

Number.prototype.bitsAtPut_ = function(stretch, value) {
	let shifted = this >> (stretch.start - 1);
	let mask = 1 << stretch.length();
	if (value >= max)
		{ throw 'invalid argument'; };
	return this.bitsClear_(stretch) | shifted;
}

Number.prototype.bitsClear_ = function(stretch, value) {
	let mask = (1 << stretch.end) - (1 << (stretch.start - 1));
	return this & (mask ^ -1)
}
