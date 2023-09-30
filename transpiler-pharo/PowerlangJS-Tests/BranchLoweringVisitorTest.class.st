Class {
	#name : #BranchLoweringVisitorTest,
	#superclass : #TestCase,
	#category : #'PowerlangJS-Tests'
}

{ #category : #tests }
BranchLoweringVisitorTest >> lower: aString [

	^ self lower: aString in: UndefinedObject
]

{ #category : #tests }
BranchLoweringVisitorTest >> lower: methodSource in: aBehavior [

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
			nextChunkPut: 'BranchLoweringVisitorTest method';
			cr ].
	^ method ast acceptVisitor: BranchLoweringVisitor new
]

{ #category : #tests }
BranchLoweringVisitorTest >> test010emptyMethod [

	| ast |
	ast := self lower: 'foo'.
	self assert: ast class equals: RBMethodNode; assert: ast statements isEmpty
]

{ #category : #tests }
BranchLoweringVisitorTest >> test011returnSelf [

	| ast statements |
	ast := self lower: 'foo ^self'.
	statements := ast statements.
	self
		assert: statements size equals: 1;
		assert: statements first isReturn;
		assert: statements first value isSelfVariable
]

{ #category : #tests }
BranchLoweringVisitorTest >> test013returnTrue [

	| ast statements return literal |
	ast := self lower: 'foo ^true'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	literal := return value.
	self
		assert: return isReturn;
		assert: literal isLiteralNode;
		assert: literal value equals: true
]

{ #category : #tests }
BranchLoweringVisitorTest >> test014returnFalse [

	| ast statements return literal |
	ast := self lower: 'foo ^false'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	literal := return value.
	self
		assert: return isReturn;
		assert: literal isLiteralNode;
		assert: literal value equals: false
]

{ #category : #tests }
BranchLoweringVisitorTest >> test015returnSymbol [

	| ast statements return literal |
	ast := self lower: 'foo ^#foo'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	literal := return value.
	self
		assert: return isReturn;
		assert: literal isLiteralNode;
		assert: literal value equals: #foo
]

{ #category : #tests }
BranchLoweringVisitorTest >> test016returnArgument [

	| ast statements return arg |
	ast := self lower: 'foo: pepe ^pepe'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	arg := return value.
	self
		assert: return isReturn;
		assert: arg isArgumentVariable;
		assert: arg name equals: #pepe
]

{ #category : #tests }
BranchLoweringVisitorTest >> test017returnTemporary [

	| ast statements return temp |
	ast := self lower: 'foo | temp | ^temp'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	temp := return value.
	self
		assert: return isReturn;
		assert: temp isTempVariable;
		assert: temp name equals: #temp
]

{ #category : #tests }
BranchLoweringVisitorTest >> test018returnIVar [

	| ast statements return ivar |
	ast := self lower: 'foo ^x' in: Point.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	ivar := return value.
	self
		assert: return isReturn;
		assert: ivar isInstanceVariable;
		assert: ivar name equals: #x
]

{ #category : #tests }
BranchLoweringVisitorTest >> test020returnNullarySendResult [

	| ast statements return send |
	ast := self lower: 'foo ^self foo'.
	statements := ast statements.
	self assert: statements size equals: 1.
	return := statements first.
	send := return value.
	self
		assert: return isReturn;
		assert: send isMessage;
		assert: send selector equals: #foo
]

{ #category : #tests }
BranchLoweringVisitorTest >> test100sendIfTrue [

	| ast statements return send if block |
	ast := self lower: 'foo self ifTrue: [1]. ^self'.
	statements := ast statements.
	self assert: statements size equals: 2.
	if := statements first.
	self
		assert: if isBranchNode;
		assert: if condition isSelfVariable.
	block := if block.
	self
		assert: block isBlock;
		assert: block statements size equals: 1;
		assert: block statements first value equals: 1.

	return := statements second.
	send := return value.
	self
		assert: return isReturn;
		assert: send isSelfVariable
]

{ #category : #tests }
BranchLoweringVisitorTest >> test220assignResultOfIfTrueIfFalse [

	| ast statements return else if block temp |
	ast := self lower: 'foo | res | res := self ifTrue: [1] ifFalse: [2]. ^res'.
	statements := ast statements.
	self assert: statements size equals: 2.
	else := statements first.
	if := else if.
	self
		assert: else isBranchNode;
		assert: if condition isSelfVariable.
	block := else block.
	self
		assert: block isBlock;
		assert: block statements size equals: 1;
		assert: block statements first value value equals: 2.
	block := if block.
	self
		assert: block isBlock;
		assert: block statements size equals: 1;
		assert: block statements first value value equals: 1.

	return := statements second.
	temp := return value.
	self
		assert: return isReturn;
		assert: temp isTempVariable;
		assert: temp name equals: 'res'
]
