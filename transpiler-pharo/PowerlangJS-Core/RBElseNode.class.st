Class {
	#name : #RBElseNode,
	#superclass : #RBBranchNode,
	#instVars : [
		'if',
		'block'
	],
	#category : #'PowerlangJS-Core'
}

{ #category : #accessing }
RBElseNode >> acceptVisitor: aProgramNodeVisitor [

	^ aProgramNodeVisitor visitElse: self
]

{ #category : #accessing }
RBElseNode >> addAssignment: anRBVariableNode [

	| assignment |
	if addAssignment: anRBVariableNode.
	assignment := RBAssignmentNode
		              variable: anRBVariableNode
		              value: block statements last.
	block statements
		removeLast;
		add: assignment
]

{ #category : #accessing }
RBElseNode >> addReturn [

	| assignment |
	if addReturn.
	assignment := RBReturnNode value: block statements last.
	block statements
		removeLast;
		add: assignment
]

{ #category : #accessing }
RBElseNode >> block [

	^ block
]

{ #category : #accessing }
RBElseNode >> block: anRBBlockNode [

	block := anRBBlockNode
]

{ #category : #accessing }
RBElseNode >> if [

	^ if
]

{ #category : #accessing }
RBElseNode >> if: anRBIfNode [

	if := anRBIfNode
]
