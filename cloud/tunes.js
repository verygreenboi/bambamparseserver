Parse.Cloud.define("tuneline", function(request, response){
    var mCurrentUser = request.params.user;
  
    // console.log(mCurrentUser);
  
  
    // FInd followers
    var qf = new Parse.Query("Activities");
    qf.equalTo("type","follow");
    qf.equalTo("from", mCurrentUser);
  
    // Find followrs' tunes
    var qtf = new Parse.Query("Tunes");
    qtf.matchesKeyInQuery("owner", "to", qf);
  
    // Find current user's tunes
    var qmt = new Parse.Query("Tunes");
    qmt.equalTo("owner", mCurrentUser);
  
  
    // Find compound query
  
    var cmpQ = Parse.Query.or(qtf, qmt);
    cmpQ.include("owner");
    cmpQ.descending("createdAt");
    // cmpQ.find({
    //     success:function(results){
    //         console.log(results);
    //         response.success(results);
    //     },error:function(){
    //         response.error("It broke!!!");
    //     }
    // });

    cmpQ.find().then(function(results){
        if (!results){
            response.error("No tunes found");
        } else {
            // console.log(results);
            response.success(results);
        }   
    }).catch(function(err){
        response.error(err);
    });
  
});

Parse.Cloud.define("likeTune", function(req, res){
    var q = new Parse.Query("Tunes");
    q.get(req.params.tuneId).then(function(tune){
        return tune;
    }).then(function(tune){
        tune.increment("likeCount");
        return tune.save(null, { useMasterKey: true });
    }).then(function(tune){
        res.success();
    }, function(error){
        console.log(error);
        res.error(error);
    });
});

Parse.Cloud.define("dislikeTune", function(req, res){
    var q = new Parse.Query("Tunes");
    q.get(req.params.tuneId).then(function(tune){
        if (tune.get("likeCount") <= 0 ) {
            tune.set("likeCount", 0);
        } else {
            tune.increment("likeCount", -1);
        }
        return tune.save(null, { useMasterKey: true });
    }).then(function(tune){
        console.log("tune disliked");
        res.success();
    }, function(error){
        console.log(error);
        res.error(error);
    });
});