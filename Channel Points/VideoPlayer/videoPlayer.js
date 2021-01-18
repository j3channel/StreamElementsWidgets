let global = { // Settings that are set once and will always remain the same
  "channel": { // Information to do with the channel
    "id": "", // Twitch ID of the channel
    "name": "", // Username of the channel
    "oauth": "" // Oauth Token for the Channel Points
  },
  "intervals": { // Amount of time for each timer
    "ping": 60, // How often we need to PING the server
    "pong": 10, // How long to wait for a PONG from the server
    "queue": 1, // How often to check for new redemptions in the queue
    "retry": 10 // How long to wait before retrying connection to server
  },
  "redemptions": {}, // Every redemption and its video
  "volume": 100 // Overall volume of the video player
};

let state = { // Settings that may change at any point
  "last_comm": new Date(), // The last time we heard from the server
  "queue": [], // The queue of redemptions waiting to be played
  "timers": { // The ID of all the timers we have running
    "ping": 0, // Timer pinging the server
    "pong": 0, // Timer to wait for PONG from server
    "queue": 0, // Timer to check the queue of redemptions
    "retry": 0 // Timer to check if we need to reconnect
  },
  "video_playing": false // Is the video currently playing?
};

let webSocket = null; // WebSocket to connect to the server
let videoPlayer = null; // Player of videos

function start() {
  console.log("Starting widget...");
  
  // Set up the video player
  videoPlayer = document.createElement('video');
  videoPlayer.oncanplaythrough = onVideoCanPlayThrough;
  videoPlayer.onended = onVideoEnded;
  videoPlayer.volume = global.volume / 100;
  videoPlayer.setAttribute('autoplay', false);
  
  // Add the video player to the DOM
  $('body').append(videoPlayer);
  
  // Start the Queue Timer
  state.timers.queue = setInterval(onQueueCheck, global.intervals.queue * 1000);
  
  // Open the web socket to connect to the PubSub API for channel point redemptions
  openWebSocket('wss://pubsub-edge.twitch.tv');
}

function initialize(obj) {
  console.log("Initializing widget...");
  
  let fieldData = obj.detail.fieldData;
  let channel = obj.detail.channel
  
  /* CHANNEL SETTINGS */
  global.channel.id = channel.providerId;
  global.channel.name = channel.username;
  
  /* GLOBAL SETTINGS */
  global.channel.oauth = fieldData.oauth;
  global.intervals.queue = fieldData.queue_refresh;
  global.volume = fieldData.volume;
  
  // Get any/all redemption names and videos
  let redemptions = Object.getOwnPropertyNames(fieldData).filter(r => r.includes('redemption_name_'));
  for (let i = 0; i < redemptions.length; i++) {
    let name = fieldData[redemptions[i]]; // Name of redemption
    let video = fieldData[redemptions[i].replace('name', 'video')]; // Video for redemption
    
    // If we have a valid name and video source for the redemption
    if (name && video) {
      global.redemptions[name.toUpperCase()] = video;
    }
  }
  
  console.log(global.redemptions);
}

window.addEventListener('onWidgetLoad', function(obj) { 
  // Code goes here
  console.log("Widget has loaded! Noice!");
  console.log(obj);
  
  // Force an update of the session data
  onWidgetSessionUpdated(obj);
  
  initialize(obj);
  start();
});

window.addEventListener('onSessionUpdate', onWidgetSessionUpdated);

function openWebSocket(url) {
  console.log("Opening web socket for URL: " + url);
  
  // Set up the web socket
  webSocket = new WebSocket(url);
  webSocket.onclose = onWebSocketClosed;
  webSocket.onerror = onWebSocketError;
  webSocket.onmessage = onWebSocketMessage;
  webSocket.onopen = onWebSocketOpen;
}

/* TIMER EVENT METHODS */
function onPingCheck() {
  console.log("Checking if PING required");
  
  let now = new Date(); // Right now
  let nextPing = new Date(state.last_comm); // When we need to send the next ping by
  nextPing.setMilliseconds(nextPing.getMilliseconds() + (global.intervals.ping * 1000));
  
  // If it's past when we needed to check for a ping
  if (now > nextPing) {
    console.log("PING Required! Pinging server...");
    
    // Send a PING to the server
    webSocket.send(JSON.stringify({ 'type': "PING" }));
    
    // Start the PONG check
    state.timers.pong = setTimeout(onPongCheck, global.intervals.pong * 1000);
  }
}

function onPongCheck() {
  console.log("Checking if PONG or MESSAGE received");
  
  let now = new Date(); // Right now
  let pongBy = new Date(state.last_comm); // When we needed to hear from the server by
  pongBy.setMilliseconds(pongBy.getMilliseconds() + (global.intervals.pong * 1000));
  
  // If it's been a while since we heard from the server
  if (now > pongBy) {
    console.log("Server inactive. Disconnecting...");
    
    // Force a disconnect
    webSocket.close();
  }
}

function onQueueCheck() {
  console.log("Checking queue...");
  
  // Check to see if we're ready to play a video and if there is an item in the queue
  if (!state.video_playing && state.queue.length > 0) {
    console.log("Playing video!");
    
    // Grab the video source from queue and pass it to video player
    let video = state.queue.shift();
    videoPlayer.setAttribute('src', video);
    
    // Set video playing as true
    state.video_playing = true;
  }
}

/* VIDEO PLAYER EVENT METHODS */
function onVideoCanPlayThrough() {
  console.log("Video is ready to play!");
  
  // Play video
  $(videoPlayer).css({ 'opacity': 1.0 });
  videoPlayer.play();
}

function onVideoEnded() {
  console.log("Video has ended!");
  
  // Reset the video source
  videoPlayer.setAttribute('src', "");
  
  // Signal that we are ready for the next video
  $(videoPlayer).css({ 'opacity': 0.0 });
  
  // Set status as no longer playing
  state.video_playing = false;
}

/* WEBSOCKET EVENT METHODS */
function onWebSocketClosed(obj) {
  console.log("Websocket closed!");
  
  // Clear existing timers
  clearInterval(state.timers.ping);
  clearTimeout(state.timers.pong);
  clearInterval(state.timers.queue);
  
  console.log("Retrying connection to server in " + global.intervals.retry + "s");
  
  // Set timer to retry connection
  state.timers.retry = setInterval(openWebSocket, global.intervals.retry * 1000, 'wss://pubsub-edge.twitch.tv');
}

function onWebSocketError(obj) {
  console.log("Error in WebSocket!");
  
  // Force closed the web socket
  webSocket.close();
}

function onWebSocketMessage(obj) {
  console.log("Message received from Web Socket!");
  
  let response = JSON.parse(obj.data);
  
  // If there has been no error
  if (!response.error) {
    // Is the response a type MESSAGE
    if (response.type == "MESSAGE") {
      let message = JSON.parse(response.data.message);
      
      console.log("Event type: " + message.type);
      
      // If the message we have received is a channel points redemption
      if (message.type == "reward-redeemed") {
        let redemption = message.data.redemption;
        let title = redemption.reward.title.toUpperCase();
        
        console.log("Reward Name: " + title);
        
        // If it is a valid redemption and matches our list to play videos for
        if (global.redemptions[title] && redemption.status == "UNFULFILLED") {
          console.log("Valid redemption!");
          
          // Add the video source to the queue
          state.queue.push(global.redemptions[title]);
        }
      }
    }
    else if (response.type == "RECONNECT") {
      console.log("Server requests reconnect...");
      
      // Force a disconnect
      webSocket.close();
      return;
    }
    
    // Stop the Pong Timeout
    clearTimeout(state.timers.pong);
    
    // Set the last time we heard from the server as right now.
    state.last_comm = new Date();
  }
  else {
    console.log("Error message: " + error.message);
    
    // Force a disconnect
    webSocket.close();
  }
}

function onWebSocketOpen(obj) {
  console.log("Web Socket open!");
  
  // Clear retry timer
  clearInterval(state.timers.retry);
  
  // Set the PING timer
  state.timers.ping = setInterval(onPingCheck, global.intervals.ping * 1000);
  
  // Compile a listen request for channel point redemptions
  let data = {
    "type": "LISTEN",
    "data": {
      "topics": [ "channel-points-channel-v1." + global.channel.id ],
      "auth_token": global.channel.oauth
    }
  }
  
  console.log("Sending listen request...");
  
  // Send the listen request
  webSocket.send(JSON.stringify(data));
}
