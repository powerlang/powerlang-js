ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
IMAGE_SEGMENTS_DIR=$(ROOT_DIR)/image-segments

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
	cd powerlang && ./pharo powerlangjs.image eval "JSTranspiler transpilePowerlangInterpreter"

interpreter: interpreter/PowertalkEvaluator.js

image-segments/kernel.json: powerlang/powerlangjs.image
	export IMAGE_SEGMENTS_DIR
	cd powerlang && ./pharo powerlangjs.image eval "JSTranspiler generateKernelSegment"




