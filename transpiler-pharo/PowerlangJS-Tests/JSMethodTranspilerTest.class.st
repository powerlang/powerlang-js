Class {
	#name : #JSMethodTranspilerTest,
	#superclass : #TestCase,
	#category : #'PowerlangJS-Tests'
}

{ #category : #tests }
JSMethodTranspilerTest >> test010emptyMethod [
	| code |
	code := self transpile: 'foo'.
	self
		assert:
			code
				=
					'(function (evaluator, frame, literals) {
	return frame.__self;
})
'
]
