[![Build Status](https://travis-ci.org/verygreenboi/bambamparseserver.svg?branch=master)](https://travis-ci.org/verygreenboi/bambamparseserver)
# parse-server-example

Example project using the parse-server module on Express.

Read the full server guide here: https://parse.com/docs/server/guide

### For Local Development

* Make sure you have at least Node 4.1. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Install mongo locally using http://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/
* Run `mongo` to connect to your database, just to make sure it's working. Once you see a mongo prompt, exit with Control-D
* Run the server with: `npm start`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `export PARSE_MOUNT=/1` before launching the server.
* You now have a database named "dev" that contains your Parse data
* Install ngrok and you can test with devices

### Getting Started With Heroku + Mongolab Development

* Clone the repo and change directory to it
* Use the Heroku Toolbelt to log in and prepare the app
* Use the MongoLab addon: `heroku addons:create mongolab:sandbox`
* Use `heroku config` and note the URI provided by MongoLab under the var MONGOLAB_URI 
* Copy this URI and set it as a new config variable: `heroku config:set DATABASE_URI=mongodb://...`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `heroku config:set PARSE_MOUNT=/1`
* Deploy it with: `git push heroku master`

### Using it

You can use the REST API, the JavaScript SDK, and any of our open-source SDKs:

Example request to a server running locally:

```
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://localhost:1337/parse/classes/GameScore
  
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:1337/parse/functions/hello
```

Example using it via JavaScript:

```
Parse.initialize('myAppId','unused');
Parse.serverURL = 'https://whatever.herokuapp.com';
var obj = new Parse.Object('GameScore');
obj.set('score',1337);
obj.save().then(function(obj) {
  console.log(obj.toJSON());
  var query = new Parse.Query('GameScore');
  query.get(obj.id).then(function(objAgain) {
    console.log(objAgain.toJSON());
  }, function(err) {console.log(err); });
}, function(err) { console.log(err); });
```

You can change the server URL in all of the open-source SDKs, but we're releasing new builds which provide initialization time configuration of this property.
