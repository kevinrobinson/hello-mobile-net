# hello-mobile-net
fiddling with mobile net predictions in tensorflow.js

adapted from https://github.com/google/emoji-scavenger-hunt/ and https://medium.com/tensorflow/a-look-at-how-we-built-the-emoji-scavenger-hunt-using-tensorflow-js-3d760a7ebfe6

### Demo
https://hello-mobile-net.herokuapp.com/

![dog](docs/dog.PNG)

![frying-pan](docs/frying-pan.PNG)

![shark](docs/shark.PNG)

### Development
`$ yarn start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### repl.it
https://repl.it/@kevinrobinson/NormalMiserlyWorkspace is an older version and works, showing that these can be made in repl.it and shared.  I couldn't figure out how to upload binary files to repl.it, and fetching models from https://hello-mobile-net.herokuapp.com/ or emoji scavenger hunt leads to errors since they don't allow cross-origin requests, so model files are hosted in a S3 bucket that allows them.
