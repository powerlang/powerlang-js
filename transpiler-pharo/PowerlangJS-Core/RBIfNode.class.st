Class {
	#name : #RBIfNode,
	#superclass : #RBBranchNode,
	#instVars : [
		'condition',
		'block'
	],
	#category : #'PowerlangJS-Core'
}

{ #category : #visiting }
RBIfNode >> acceptVisitor: aProgramNodeVisitor [
	^aProgramNodeVisitor visitIf: self
]

{ #category : #accessing }
RBIfNode >> addAssignment: anRBVariableNode [

	| assignment |
	assignment := RBAssignmentNode
		              variable: anRBVariableNode
		              value: block statements last.
	block statements
		removeLast;
		add: assignment
]

{ #category : #accessing }
RBIfNode >> addReturn [

	| assignment |
	assignment := RBReturnNode
		              value: block statements last.
	block statements
		removeLast;
		add: assignment
]

{ #category : #accessing }
RBIfNode >> block [

	^ block
]

{ #category : #accessing }
RBIfNode >> block: anRBBlockNode [

	block := anRBBlockNode
]

{ #category : #accessing }
RBIfNode >> condition [

	^ condition
]

{ #category : #accessing }
RBIfNode >> condition: anRBProgramNode [

	condition := anRBProgramNode
]
