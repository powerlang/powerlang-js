
// here we define a few base objects/classes/methods that we are going to add to the js environment
// for our smalltalk VM.

// The code of VM itself is transpiled to native JS, so VM's true is JS true, VM numbers are JS numbers.
// On the other hand, the Smalltalk image to be loaded has a true object that is a JS object (diferent from
// true), same for false, etc. 



// Support for transpiling Smalltalk cascades in VM code:
// JS doesn't support Smalltalk cascades directly. Our transliterator uses this _cascade function
// instead, generating code for evaluating the receiver with a closure that executes all the messages
// with that receiver. 
let _cascade = function(receiver, cascadeStatements) { return cascadeStatements(receiver);}


// Support for nil in VM code:
// Unfortunately it is not possible to extend JS null with methods, so we define an object for nil
// and try to avoid using null anywhere

let nil = {}

Object.prototype.ifNil = function(closure) { if (this == nil) { return closure() } else { return nil } }

Object.prototype.ifNotNil = function(closure) { if (this == nil) { return nil } else {return closure(this)} }

Object.prototype.new = function() { return new this;}

// add some Smalltalk-ish methods to JS booleans

Boolean.prototype.ifTrue  = function(closure) { if (this == true) { return closure() } else {return nil } }
Boolean.prototype.ifFalse = function(closure) { if (this == true) { return nil } else { return closure() } }
Boolean.prototype.ifTrueIfFalse = function(closureTrue, closureFalse) { if (this == true) { return closureTrue() } else {return closureFalse() } }

Boolean.prototype._or  = function (b) { return this || b }
Boolean.prototype._and = function (b) { return this && b }

// loop helpers
Function.prototype.whileTrue(condition, block) = function () {
	while(condition()) { block() }
	return nil;
}

Function.prototype.whileFalse(condition, block) = function () {
	while(!condition()) { block() }
	return nil;
}

// add some Smalltalk-ish methods to JS numbers
Number.prototype._plus = function(value) { return this + value; }
Number.prototype._minus = function(value) { return this - value; }
Number.prototype._times = function(value) { return this * value; }
Number.prototype._slash = function(value) { return this / value; }
Number.prototype._modulo = function(value) { return this % value; }
Number.prototype._integerQuotient = function(value) { return int(this / value); }
Number.prototype._or = function(value) { return int(this | value); }
Number.prototype._shiftLeft = function(value) { return this << value; }
Number.prototype._shiftRight = function(value) { return this >> value; }

Number.prototype._equal = function(value) { return this ==  value; }
Number.prototype._notEqual = function(value) { return this !=  value; }
Number.prototype._equalEqual = function(value) { return this ===  value; }
Number.prototype._lessEqualThan = function(value) { return this <=  value; }
Number.prototype._lessThan = function(value) { return this <  value; }
Number.prototype._greaterEqualThan = function(value) { return this >=  value; }
Number.prototype._greaterThan = function(value) { return this >  value; }


Number.prototype.toDo = function(limit, closure) { for (i = this; i <= limit; i++) { closure(i); } }
Number.prototype.toByDo = function(limit, increment, closure) { 
	if (increment > 0) 
		for (i = this; i <= limit; i=i+increment) { closure(i); }
	else
		for (i = this; i >= limit; i=i+increment) { closure(i); }
}


