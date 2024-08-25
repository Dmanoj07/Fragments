## Development Setup

### Running Linters

To run ESLint:

1. Add this script to your `package.json`:

```json
"scripts": {
  "lint": "eslint --config eslint.config.mjs \"./src/**/*.js\""
}

Run the linter with:

bashCopynpm run lint
Starting the Server
Production
Add this script to package.json:
jsonCopy"scripts": {
  "start": "node src/server.js"
}
Run with:
bashCopynpm start
Development

Install nodemon:

bashCopynpm install --save-dev nodemon

For cross-platform compatibility, install cross-env:

bashCopynpm install --save-dev cross-env

Add these scripts to package.json:

jsonCopy"scripts": {
  "dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
}

Run the development server:

bashCopynpm run dev

For debugging:

bashCopynpm run debug
Note: If not using cross-env, replace the scripts with:
jsonCopy"scripts": {
  "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
}
