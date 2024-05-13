To run lint:
  Add this in your script to your package.json file:
        "lint": "eslint --config eslint.config.mjs \"./src/**/*.js\""
  and run this command:
    npm run lint
To start server using npm start:
  Add this in script:
    "start": "node src/server.js",

To start server using npm run dev:
  Add this in script:
  If you are using window:
    Install cross-env pacakge
    "dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  Else:
    "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",

To start server using npm run debug:
  Add this in script:
  If you are using window:
    Install cross-env pacakge
    "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
  Else:
    "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
