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
    cmpQ.ascending("createdAt");
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