// say HELLO to GET / POST request with parameter: "name"
var http = require("http");
var qs = require("querystring");
var url = require("url");
http.createServer(function(request, response) {
  var requestMethod = request.method;
  var name;
  console.info("request.method: " + requestMethod);
  if (requestMethod === "GET") {
    var path = url.parse(request.url);
    var parameters = qs.parse(path.query);
    name = parameters.name;
    echo(name);
  }
  else {
    if (requestMethod === "POST") {
      var body = "";
      request.on("data", function(chunk) {
        body += chunk;
        // Too much POST data, kill the connection!
        // 1e3 === 1 * Math.pow(10, 3) === 1 * 1000 ~~~ 1KB
        if (body.length > 1e3) {
          console.error("body.length > 10^3");
          echo();
          //request.connection.destroy();
        }
      });
      request.on("end", function() {
        var post = qs.parse(body);
        name = post.name;
        echo(name);
      });
    }
    else {
      echo();
    }
  }
  function echo(name) {
    var responseString = "Hello anonymous";
    if (name == null) {
      console.error("name null");
    }
    else {
      if (name === "") {
        console.error("name empty");
      }
      else {
        responseString = "HELLO " + name;
      }
    }
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.end(responseString);
  }
}).listen(process.env.PORT || 1856);
