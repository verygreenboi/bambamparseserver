require(__dirname + '/activity.js');
require(__dirname + '/tunes.js');
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});
