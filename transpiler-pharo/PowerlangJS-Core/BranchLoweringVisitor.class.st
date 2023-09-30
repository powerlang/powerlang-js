Class {
	#name : #BranchLoweringVisitor,
	#superclass : #Object,
	#instVars : [
		'currentCode'
	],
	#category : #'PowerlangJS-Core'
}

{ #category : #visiting }
BranchLoweringVisitor >> visitArgumentVariableNode: anRBArgumentNode [

	^ anRBArgumentNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitArrayNode: aRBArrayNode [

	^ aRBArrayNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitAssignmentNode: anRBAssignmentNode [

	| v |
	v := anRBAssignmentNode value acceptVisitor: self.
	v isBranchNode ifTrue: [
		v addAssignment: anRBAssignmentNode variable.
		anRBAssignmentNode replaceWith: v].
	^v
]

{ #category : #visiting }
BranchLoweringVisitor >> visitBlockNode: anRBBlockNode [

	| prev |
	prev := currentCode.
	currentCode := anRBBlockNode.
	anRBBlockNode statements copy do: [ :s | s acceptVisitor: self ].
	currentCode := prev.
	^anRBBlockNode 
]

{ #category : #visiting }
BranchLoweringVisitor >> visitCascadeNode: anRBCascadeNode [

	^ anRBCascadeNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitClassVariableNode: anRBVariableNode [

	^ anRBVariableNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitGlobalVariableNode: anRBGlobalNode [

	^ anRBGlobalNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitIf: anRBMessageNode with: aBoolean [

	| receiver block if original |
	receiver := anRBMessageNode receiver acceptVisitor: self.
	original := anRBMessageNode arguments first.
	block := original acceptVisitor: self.
	original isBlock ifFalse: [ ^ anRBMessageNode ].
	aBoolean ifFalse: [ 
		receiver := RBMessageNode receiver: receiver selector: #not ].
	if := RBIfNode new
		      condition: receiver;
		      block: block.

	anRBMessageNode replaceWith: if.
	^ if
]

{ #category : #visiting }
BranchLoweringVisitor >> visitIfTrueIfFalse: anRBMessageNode with: aBoolean [

	| receiver tblock fblock if else |
	receiver := anRBMessageNode receiver acceptVisitor: self.
	tblock := anRBMessageNode arguments first acceptVisitor: self.
	fblock := anRBMessageNode arguments second acceptVisitor: self.
	tblock isBlock ifFalse: [ ^ anRBMessageNode ].
	fblock isBlock ifFalse: [ ^ anRBMessageNode ].
	aBoolean ifFalse: [ 
		receiver := RBMessageNode receiver: receiver selector: #not ].
	if := RBIfNode new
		      condition: receiver;
		      block: tblock.
	else := RBElseNode new if: if; block: fblock.
	anRBMessageNode replaceWith: else.
	^ else
]

{ #category : #visiting }
BranchLoweringVisitor >> visitInstanceVariableNode: anRBInstanceVariableNode [

	^ anRBInstanceVariableNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitLiteralArrayNode: anRBLiteralArrayNode [

	^ anRBLiteralArrayNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitLiteralValueNode: anRBLiteralValueNode [
	^anRBLiteralValueNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitMessageNode: anRBMessageNode [

	| selector |
	selector := anRBMessageNode selector.
	selector == #ifTrue: ifTrue: [ 
		^ self visitIf: anRBMessageNode with: true ].
	selector == #ifFalse: ifTrue: [ 
		^ self visitIf: anRBMessageNode with: false ].
	selector == #ifTrue:ifFalse: ifTrue: [ 
		^ self visitIfTrueIfFalse: anRBMessageNode with: true ].
	"	selector == #ifNil: ifTrue: [ 
		^ self visitIfNil: anRBMessageNode with: true ].
	selector == #ifNotNil: ifTrue: [ 
		^ self visitIfNil: anRBMessageNode with: false ].
	selector == #ifTrue:ifFalse: ifTrue: [ 
		^ self visitIfNilIfNotNil: anRBMessageNode ].
	selector == #whileTrue ifTrue: [ 
		^ self visitWhile: anRBMessageNode with: true ].
	selector == #whileFalse ifTrue: [ 
		^ self visitWhile: anRBMessageNode with: false ].
	selector == #whileTrue: ifTrue: [ 
		^ self visitWhileTrue_: anRBMessageNode with: true ].
	selector == #whileFalse: ifTrue: [ 
		^ self visitWhileFalse_: anRBMessageNode with: false ]."
	anRBMessageNode receiver acceptVisitor: self.
	anRBMessageNode arguments do: [ :arg | arg acceptVisitor: self ].
	^ anRBMessageNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitMethodNode: anRBMethodNode [
	self haltIf: anRBMethodNode selector = #lookupAssociationFor2:in:.
	currentCode := anRBMethodNode.
	anRBMethodNode statements copy do: [ :s | s acceptVisitor: self ].
	^ anRBMethodNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitReturnNode: anRBReturnNode [

	| v |
	v := anRBReturnNode value acceptVisitor: self.
	v isBranchNode
		ifTrue: [
			v addReturn.
			currentCode statements removeLast]
]

{ #category : #visiting }
BranchLoweringVisitor >> visitSelfNode: anRBSelfNode [ 

	^ anRBSelfNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitSuperNode: anRBSuperNode [

	^ anRBSuperNode
]

{ #category : #visiting }
BranchLoweringVisitor >> visitTemporaryVariableNode: anRBTemporaryNode [

	^ anRBTemporaryNode
]
