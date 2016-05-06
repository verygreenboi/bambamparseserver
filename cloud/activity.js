Parse.Cloud.beforeSave('Activities', function(request, response) {
  var currentUser = request.user;
  var objectUser = request.object.get('from');

  console.log(currentUser);
  
  if(!currentUser || !objectUser) {
    response.error('An Activity should have a valid fromUser.');
  } else if (currentUser.id === objectUser.id) {
    response.success();
  } else {
    response.error('Cannot set fromUser on Activity to a user other than the current user.');
  }
});
  
// Follow notification function
  
Parse.Cloud.afterSave("Activities", function(request, response){
    // Only send push notifications for new activities
  if (request.object.existed()) {
    return;
  }
    var from = request.user;
    var to = request.object.get("to");
  
    if (!to) {
      throw "Undefined toUser. Skipping push for Activity " + request.object.get('type') + " : " + request.object.id;
      return;
    }
  
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("userId", to.id);
  
    Parse.Push.send({
    where: query, // Set our Installation query.
    data: alertPayload(request)
  }).then(function() {
    // Push was successful
    console.log('Sent push.');
  }, function(error) {
    throw "Push Error " + error.code + " : " + error.message;
  });
});
  
var alertMessage = function(request) {
  var message = "";
  
  if (request.object.get("type") === "comment") {
    if (request.user.get('username')) {
          message = request.user.get('username') + ': ' + request.object.get('content').trim();
    } else {
      message = "Someone commented on your tune.";
        }
      } else if (request.object.get("type") === "like") {
        if (request.user.get('username')) {
          message = request.user.get('username') + ' likes your tune.';
        } else {
          message = 'Someone likes your tune.';
        }
      } else if (request.object.get("type") === "follow") {
        if (request.user.get('username')) {
          message = request.user.get('username') + ' is now following you.';
        } else {
          message = "You have a new follower.";
        }
      }
  
      // Trim our message to 500 characters.
      if (message.length > 500) {
        message = message.substring(0, 500);
      }
  
      return message;
    }
  
var alertPayload = function(request) {
  var payload = {};
  
  if (request.object.get("type") === "comment") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct Tune in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'c', // Activity Type: Comment
      fu: request.object.get('from').id, // From User
      pid: request.object.get('tune').id // Tune Id
    };
  } else if (request.object.get("type") === "like") {
    return {
      alert: alertMessage(request), // Set our alert message.
      // The following keys help Anypic load the correct Tune in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'l', // Activity Type: Like
      fu: request.object.get('from').id, // From User
      pid: request.object.get('tune').id // Tune Id
    };
  } else if (request.object.get("type") === "follow") {
    return {
      alert: alertMessage(request), // Set our alert message.
      // The following keys help Anypic load the correct Tune in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'f', // Activity Type: Follow
      fu: request.object.get('from').id // From User
    };
  }
}