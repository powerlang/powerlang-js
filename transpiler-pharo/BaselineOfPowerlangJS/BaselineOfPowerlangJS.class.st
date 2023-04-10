Class {
	#name : #BaselineOfPowerlangJS,
	#superclass : #BaselineOf,
	#category : #BaselineOfPowerlangJS
}

{ #category : #baselines }
BaselineOfPowerlangJS >> baseline: spec [
	<baseline>
	spec for: #common do: [
		spec baseline: 'OCompiler' with: [
			spec loads: 'Core'.
			spec repository: 'github://powerlang/ocompiler:main'
		].

		spec package: 'Powerlang-JS' with:[
			spec requires: 'OCompiler'.
		].
		spec package: 'Powerlang-JS-Tests'.

		"base group: just core boostrapping code and tests"
		spec group: 'base' with: #('Powerlang-JS-Core'
		                           'Powerlang-JS-Tests').

		"default group: loaded when group is not specified"
		spec group: 'default' with: #('base')
	]
]
