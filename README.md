## Prerequisites
 ```js
 This projects assumes git, node and Bower are installed globally. 
 
 If thats not the case you can do so by using following guidelines:
 Example on Ubuntu:
  - sudo apt-get install git nodejs
 - https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager 
 
 if you get in trouble with this feel free to email : contact@vipintanna.com
```


## Installing on your local
 ```js
 npm install && bower install && gulp 
 && ./node_modules/http-server/bin/http-server -a localhost -p 9090 www/ -o
 
  - This will install a fresh copy of vtsore on your machine ready to run.
```

## Compiling on your local

```js
 These are the following gulp tasks you could use :
 
 gulp default
  - Compiles the project as a whole except css which has to be done seperately.
  
 gulp css  
  - Compiles relevant css files and minifies them to single file.
  
 gulp html
  - Compiles relevant html file (index.html) and minifies them to single file.
  
 gulp partials
  - Compiles relevant partial files located in partials directory and minifies them to single file.
  
 gulp fonts
  - Compiles relevant fonts and copies them to www directory.
  
 gulp data
  - Compiles relevant data files and copies them to www directory.
  
 gulp images
  - Compiles relevant image files and copies them to www directory.
  
 gulp jscheck
  - Checks javascript syntax errors and reports them before compiling javascript files.
  
 gulp js
  - Compiles relevant js files and minifies them to single file.
  
 gulp watch
  - Watches for any new changes related to above tasks mentioned.
```


## Want to contribute?

Anyone can help make this project better - check out the [Contributing guide](/CONTRIBUTING.md)!
