.PHONY: all interpreter kernel

all: interpreter kernel

powerlang/bootstrap.image: powerlang
	make -C powerlang bootstrap.image

powerlang:
	git clone git@github.com:powerlang/powerlang.git

kernel: image-segments/kernel.json

interpreter/PowertalkEvaluator.js: powerlang/bootstrap.image
	make -C powerlang powerlangjs

interpreter: interpreter/PowertalkEvaluator.js

image-segments/kernel.json: powerlang/bootstrap.image
	KERNEL_FILE=$@ make -C powerlang powerlangjs-kernel

