// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');

if (!process.env.DATABASE_URI) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: 'PwYxMbm5w2ztP5EKIx1bqt5HZIYMoHFy3b7xhDKF',
  fileKey: 'myFileKey',
  masterKey: 'JiMigz1dN7elHVkdBPJnIXaNh1JcJjjtTsa0oaIw',
  clientKey: 'vdt6fZ35u9spxuoDdpHzCm9bvqRNCufKarlzhzbk',
  restAPIKey: 'lQd0hFfxV58CadtKoEgl5D2kAAKa34AH8lgjJEP1',
  javascriptKey: 'UH1ELIVpigs6BchmsXv8cWROTxloQX2eZwgvVaVJ',
  dotNetKey: 'myDotNetKey',
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
