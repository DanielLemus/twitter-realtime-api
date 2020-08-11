const express = require("express");
const app = express();
const fetch = require("node-fetch");
const http = require("http");
const socketIo  = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, { origins: '*:*'}); 

server.listen(3100, () => {
 console.log("El servidor está inicializado en el puerto 3100");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let interval;

io.on("connection", (socket) => {

  console.log("New client connected");

  socket.on("searchByHashtag", (hashtag) => {

    console.log("New hashtag", hashtag);

    if (interval) {
      clearInterval(interval);
    }
  
    interval = setInterval(function(){getTweets(hashtag)}, 3000);

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

});

 function getTweets(hashtag) {

  var requestOptions = {
    method: 'GET',
    headers: {
      "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAAs5%2FAAAAAAA%2BFhxtLDRr2AuKh5zdIHTczhg0Jg%3DltF0dqGzLFlmXH9wjI8HkO1gEzGlnCYUegwIOVVu1Umn8Yi1sX",
      "Cookie": "personalization_id=\"v1_GmtkCu4zw9ipAPpQQCTs/w==\"; guest_id=v1%3A159685839302595769"
    }
  };

 fetch("https://api.twitter.com/1.1/search/tweets.json?q=" + hashtag, requestOptions)
        .then(response => response.text())
        .then(result => io.emit('tweets', result))
        .catch(error => console.log('error', error));
}