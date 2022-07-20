# js-smalltalk-vm
A Smalltalk VM that runs on top of JavaScript

# This readme is strongly WIP

# System overview

The code in this repo is part of a Smalltalk System designed to run on top of JavaScript.
We include here the tools to plug a JavaScript version of the Powerlang Smalltalk Interpreter
with a Smalltalk image, and to let them run together.

The VM is based on the Powerlang Smalltalk Interpreter. To be able to use the interpreter from
JavaScript, we need to rewrite it to JavaScript. Instead of doing that, Powerlang provides a 
JavaScript transpiler, which takes the interpreter code (written in Smalltalk), generates JS code,
and writes it into `interpreter` folder.


With the transpiled interpreter, and the glue code provided in this repo, we can load a Smalltalk
kernel with a bunch of Smalltalk objects reified in JS and run code. 
To generate the kernel, we again rely in Powerlang. We first execute the Powerlang bootstrap process
to create an initial Powertalk kernel module. We then load an image segmement writer that outputs the
kernel objects in a JSON format, which this repo can load and plug into the VM.

With the VM and the image, it's just a matter of running `nodejs main.js`

# Creating an image

*WIP* In order to run your Smalltalk image in the browser, you have to convert it to a format compatible
with this VM. 


