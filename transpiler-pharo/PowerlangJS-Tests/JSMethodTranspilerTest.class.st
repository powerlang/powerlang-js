Class {
	#name : #JSMethodTranspilerTest,
	#superclass : #TestCase,
	#category : #'PowerlangJS-Tests'
}

{ #category : #tests }
JSMethodTranspilerTest >> compile: aString [
	^ self compile: aString in: UndefinedObject 

]

{ #category : #tests }
JSMethodTranspilerTest >> compile: methodSource in: aBehavior [
	| compiler method |
	compiler := OpalCompiler new.
	compiler
		class: aBehavior;
		source: methodSource.
		method := compiler compile.
	method putSource: methodSource withPreamble: [ :f | 
		f
			cr;
			nextPut: $!;
			nextChunkPut: 'OCompiler method';
			cr ].
	^method
]

{ #category : #tests }
JSMethodTranspilerTest >> compileAndTranspile: aString [

	| method |
	method := self compile: aString.
	^ self transpile: method 
]

{ #category : #tests }
JSMethodTranspilerTest >> test010emptyMethod [
	| code |
	code := self compileAndTranspile: 'foo'.
	self assert: code equals: '	foo() {
		return this;
	}

'
]

{ #category : #tests }
JSMethodTranspilerTest >> test020returnSelf [
	| code |
	code := self compileAndTranspile: 'foo ^self'.
	self assert: code equals: '	foo() {
		return this;
	}

'
]

{ #category : #tests }
JSMethodTranspilerTest >> transpile: method [
	^ JSMethodTranspiler new
		  method: method;
		  transpile;
		  result
]
