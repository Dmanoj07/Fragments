## Running Linters

To run ESLint from the command line, add a lint script to your `package.json` file:

```json
"scripts": {
  "lint": "eslint --config eslint.config.mjs \"./src/**/*\.js\""
}

Starting the Server Automatically
Install the nodemon package to automatically restart the server during development

npm install --save-dev nodemon
Then, add the following scripts to your package.json file to start the server:

"scripts": {
  "start": "node src/server.js"
}

Development and Debugging in Windows
Install the cross-env package to set environment variables across platforms:
npm install --save-dev cross-env

Add these scripts to your package.json for development and debugging:

"scripts": {
  "dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
}

Alternatively, if you’re not using cross-env, you can use:
"scripts": {
  "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
}


```
