// Global, unchangeable fields (set once)
let global = {
  "channel": {
    "id": "",
    "name": "",
  },
  "chat": {
    "connected": "",
    "name": "",
    "oauth": ""
  },
  "redemptions": {
    "oauth": ""
  },
  "timeouts": {
    "other": {
      "duration": 0,
      "name": "",
      "sound": "",
      "response": "",
    },
    "self": {
      "duration": 0,
      "name": "",
      "sound": "",
      "response": ""
    }
  },
  "volume": 0
}

// Settings that change throughout 
let state = {
  "timers": {
    "redemptions": {
      "ping": 0,
      "timeout": 0
    },
    "queue": 0,
  },
  "playing": false,
  "queue": []
}

let redemptionsServer = null;
let chatServer = null;
let audio = null;

window.addEventListener("onWidgetLoad", onWidgetLoaded);

/* INITIALIZATION METHODS */
function initialize(obj) {
  console.log('[AUTO-TIMEOUT] - Initializing...');
  
  let fieldData = obj.detail.fieldData;
  
  /* Channel Properties */
  global.channel.id = obj.detail.channel.providerId;
  global.channel.name = obj.detail.channel.username;
  global.redemptions.oauth = fieldData["redemptions_oauth"];
  
  /* Chat Properties */
  global.chat.connected = fieldData["chat_connected"];
  global.chat.name = fieldData["chat_name"];
  global.chat.oauth = fieldData["chat_oauth"];
  
  /* Reward Other Properties */
  global.timeouts.other.name = fieldData["timeout_other_name"].toLowerCase();
  global.timeouts.other.duration = fieldData["timeout_other_duration"];
  global.timeouts.other.sound = fieldData["timeout_other_sound"];
  global.timeouts.other.response = fieldData["timeout_other_response"];
  
  /* Reward Self Properties */
  global.timeouts.self.name = fieldData["timeout_self_name"].toLowerCase();
  global.timeouts.self.duration = fieldData["timeout_self_duration"];
  global.timeouts.self.sound = fieldData["timeout_self_sound"];
  global.timeouts.self.response = fieldData["timeout_self_response"];
  
  global.volume = fieldData["volume"] / 100;
}

function start() {
  console.log('[AUTO-TIMEOUT] - Starting...');
  
  // Open the web socket for the Redemptions API
  setTimeout(() => { connectToRedemptions(); }, 5000);
  
  // Open the web socket for the Chat API
  setTimeout(() => { connectToChat(); }, 5000);
  
  // Keep checking the queue
  state.timers.queue = setInterval(onQueueCheck, 1000);
  
  // Create audio element and set volume
  audio = document.createElement('audio');
  audio.onended = onAudioEnded;
  audio.error = onAudioEnded;
  audio.volume = global.volume;
}

/* AUDIO EVENT */
function onAudioEnded() {
  console.log('[AUTO-TIMEOUT] - Audio Ended');
  
  state.playing = false;
  audio.setAttribute('src', null);
}

/* QUEUE EVENT */
function onQueueCheck() {
  // If we're not currently playing something and there is a queued person
  if (!state.playing && state.queue.length > 0 && chatServer != null) {
    let event = state.queue.shift();
    
    // Send the chat command if available
    console.log('[AUTO-TIMEOUT] - Timing out: ' + event.target);
    
    state.playing = true;
    
    sendChatMessage('/timeout @' + event.target + ' ' + event.duration);
    sendChatMessage(event.response.replace('{target}', event.target).replace('{user}', event.sender));
    
    if (event.sound) {
      audio.setAttribute('src', event.sound);
      audio.play();
    }
    else
      state.playing = false;
  }
}

/* REDEMPTIONS SERVER METHODS */
function connectToRedemptions() {
  // Create new websocket for redemptions server
  redemptionsServer = new WebSocket('wss://pubsub-edge.twitch.tv');
  redemptionsServer.onopen = onRedemptionsOpen;
  redemptionsServer.onclose = onRedemptionsClosed;
  redemptionsServer.onerror = onRedemptionsError;
  redemptionsServer.onmessage = onRedemptionsMessage;
}

function onRedemptionsOpen(obj) {
  console.log('[AUTO-TIMEOUT] - Redemptions server open!');
  
  // Set ping timer
  state.timers.ping = setInterval(onRedemptionsPing, 150000);
  
  // Send the listen data to the server
  let data = {
    "type": "LISTEN",
    "data": {
      "topics": ["channel-points-channel-v1." + global.channel.id],
      "auth_token": global.redemptions.oauth
    }
  };
  
  redemptionsServer.send(JSON.stringify(data));
}

function onRedemptionsClosed(obj) {
  console.log('[AUTO-TIMEOUT] - Redemptions server closed!');
  
  clearInterval(state.timers.ping);
  clearTimeout(state.timers.timeout);
  
  // Reconnect after 10s
  console.log('[AUTO-TIMEOUT] - Attempting redemptions reconnect in 10s...');
  setTimeout(() => { connectToRedemptions(); }, 10000);
}

function onRedemptionsError(obj) {
  console.log('[AUTO-TIMEOUT] - Redemptions server error!');
  
  // Disconnect from the server
  redemptionsServer.close();
}

function onRedemptionsMessage(obj) {
  console.log('[AUTO-TIMEOUT] - Redemptions message received!');
  
  let response = JSON.parse(obj.data);
  
  // As long as there is no error
  if (!response.error) {
    if (response.type == "MESSAGE") {
      // If we've received a message
      let message = JSON.parse(response.data.message);
      
      // If we've received a redemption
      if (message.type == "reward-redeemed") {
        let redemption = message.data.redemption;
        let title = redemption.reward.title.toLowerCase();
        
        // If it matches the other target
        if (title == global.timeouts.other.name || title == global.timeouts.self.name) {
          console.log('[AUTO-TIMEOUT] - Timeout redeemed by: ' + redemption.user.login);
          
          let isOther = title == global.timeouts.other.name;
          
          // Create the event object
          let timeout = {
            "duration": isOther ? global.timeouts.other.duration : global.timeouts.self.duration,
            "response": isOther ? global.timeouts.other.response : global.timeouts.self.response,
            "sound": isOther ? global.timeouts.other.sound : global.timeouts.self.sound,
            "sender": redemption.user.login,
            "target": isOther ? redemption.user_input.split(' ')[0].replace('@', '') : redemption.user.login
          }
          
          // Add event to queue
          state.queue.push(timeout);
        }
      }
  	}
    else if (response.type == "RECONNECT") {
      // If the server is asking us to reconnect
      console.log('[AUTO-TIMEOUT] - Redemptions server reconnect requested!');
      redemptionsServer.close();
    }
    else if (response.type == "PONG") {
      // Stop the timeout timer
      console.log('[AUTO-TIMEOUT] - Redemptions server pong received!');
      clearTimeout(state.timers.timeout);
    }
  }
  else
    redemptionsServer.close();
  
}

function onRedemptionsPing() {
  console.log('[AUTO-TIMEOUT] - Pinging Redemptions server...');
  
  // Send a ping to the server
  redemptionsServer.send(JSON.stringify({ "type": "PING" }));
  
  // Start the timeout timer for PONG
  state.timers.timeout = setTimeout(onRedemptionsTimeout, 10000);
}

function onRedemptionsTimeout() {
  console.log('[AUTO-TIMEOUT] - Redemptions server timed out!');
  
  // Assume we can reconnect
  redemptionsServer.close();
}

/* CHAT SERVER METHODS */
function connectToChat() {
  chatServer = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
  chatServer.onopen = onChatOpen;
  chatServer.onclose = onChatClosed;
  chatServer.onerror = onChatError;
  chatServer.onmessage = onChatMessage;
}

function sendChatMessage(message) {
  if (chatServer != null) {
    chatServer.send('PRIVMSG #' + global.channel.name + ' :' + message);
  }
}

function onChatOpen(obj) {
  console.log('[AUTO-TIMEOUT] - Chat open!');
  
  // Send auth information
  chatServer.send('PASS oauth:' + global.chat.oauth);
  chatServer.send('NICK ' + global.chat.name);
}

function onChatClosed(obj) {
  console.log('[AUTO-TIMEOUT] - Chat closed!');
  
  // Set the websocket to null
  chatServer = null;
  
  // Wait to reconnect
  console.log('[AUTO-TIMEOUT] - Attempting chat reconnect in 10s...');
  setTimeout(() => { connectToChat(); }, 10000); 
}

function onChatError(obj) {
  console.log('[AUTO-TIMEOUT] - Chat error!');
  
  // Close the websocket
  chatServer.close();
}

function onChatMessage(obj) {
  console.log('[AUTO-TIMEOUT] - Chat message received!');
  
  // Tell server we are still connected
  if (obj.data.startsWith('PING')) {
    console.log('[AUTO-TIMEOUT] - Sending PONG...');
    chatServer.send('PONG :tmi.twitch.tv');
  }
  
  let prefix = obj.data.split('tmi.twitch.tv')[1].replace(' ', '');
  
  if (prefix.startsWith('001')) {
    // Connected, so join channel
    console.log('[AUTO-TIMEOUT] - Chat connection successful!');
    chatServer.send('JOIN #' + global.channel.name);
  }
  else if (prefix.startsWith('421')) {
    console.log('[AUTO-TIMEOUT] - 421');
    console.log(obj.data);
  }
  else if (prefix.startsWith('NOTICE')) {
    // If chat credentials are invalid
    console.log('[AUTO-TIMEOUT] - Chat credentials invalid!');
    
    // Close the websocket
    chatServer.close();
  }
  else if (prefix.startsWith('JOIN')) {
    // We have successfully connected to chat
    console.log('[AUTO-TIMEOUT] - Joined chat for: ' + global.channel.name);
    if (global.chat.connected)
    	sendChatMessage(global.chat.connected);
  }
}

/* WIDGET EVENT */
function onWidgetLoaded(obj) {
  console.log('[AUTO-TIMEOUT] - Widget loaded!');
  
  initialize(obj);
  start();
}
