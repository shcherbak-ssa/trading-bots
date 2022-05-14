const { execSync } = require("child_process");


// Build server
execSync('npm install');
execSync('npm run build:server');


// Build client
execSync('cd ./client && npm install');
execSync('cd ./client && npm run build');
