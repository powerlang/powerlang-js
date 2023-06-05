.PHONY: all interpreter kernel

all: interpreter kernel

powerlang/powerlangjs.image: powerlang
	make -C powerlang bootstrap.image
	cd powerlang && ./pharo bootstrap.image save powerlangjs
	cd powerlang && ./pharo powerlangjs.image eval --save "Metacello new repository: 'github://powerlang/powerlang-js:main'; baseline: 'PowerlangJS'; load: 'base'"

powerlang/specs/current: powerlang
	make -C powerlang specs/current

powerlang:
	git clone git@github.com:powerlang/powerlang.git

kernel: image-segments/kernel.json powerlang/specs/current

interpreter/PowertalkEvaluator.js: powerlang/powerlangjs.image
	cd powerlang && ./pharo powerlang.image eval "JSTranspiler transpilePowerlangInterpreter"

interpreter: interpreter/PowertalkEvaluator.js

image-segments/kernel.json: powerlang/powerlangjs.image
	KERNEL_FILE=$@ cd powerlang && ./pharo powerlang.image eval "JSTranspiler generateKernelSegment"




