// Global, unchangeable fields (set once)
let global = {
  "adverts": {},
  "channel": {
    "id": "",
    "name": "",
  },
  "chat": {
    "connected": "",
    "name": "",
    "oauth": ""
  },
  "emoteonly": {
    "duration": 0,
    "name": "",
    "responses": {
      "continued": "",
      "started": ""
    }
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
  "emoteonly_extend": 0,
  "timers": {
    "emoteonly": 0,
    "redemptions": {
      "ping": 0,
      "timeout": 0
    },
    "queues": {
      "adverts": 0,
      "emoteonly": 0,
      "timeouts": 0
    }
  },
  "playing": {
    "adverts": false,
    "emoteonly": false,
    "timeouts": false
  },
  "queues": {
    "adverts": [],
    "emoteonly": [],
    "timeouts": []
  }
}

let redemptionsServer = null;
let chatServer = null;
let audio = null;

window.addEventListener("onWidgetLoad", onWidgetLoaded);

/* INITIALIZATION METHODS */
function initialize(obj) {
  console.log('[SLASH-BOT] - Initializing...');
  
  let fieldData = obj.detail.fieldData;
  
  /* Adverts */
  let ads = Object.getOwnPropertyNames(fieldData).filter(a => a.includes("advert_reward_"));
  for (let i = 0; i < ads.length; i++) {
    let reward = fieldData[ads[i]];
    if (reward) {
      global.adverts[reward.toLowerCase()] = {
        "duration": parseInt(fieldData[`advert_length_${i}`]),
        "response": fieldData[`advert_response_${i}`]
      };
    }
  }
  
  /* Channel Properties */
  global.channel.id = obj.detail.channel.providerId;
  global.channel.name = obj.detail.channel.username;
  global.redemptions.oauth = fieldData["redemptions_oauth"];
  
  /* Chat Properties */
  global.chat.connected = fieldData["chat_connected"];
  global.chat.name = fieldData["chat_name"];
  global.chat.oauth = fieldData["chat_oauth"];
  
  /* Emote-Only Properties */
  global.emoteonly.name = fieldData["emote_only_reward"].toLowerCase();
  global.emoteonly.duration = fieldData["emote_only_duration"];
  global.emoteonly.responses.continued = fieldData["emote_only_response_continued"];
  global.emoteonly.responses.started = fieldData["emote_only_response_started"];
  
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
  console.log('[SLASH-BOT] - Starting...');
  
  // Open the web socket for the Redemptions API
  setTimeout(() => { connectToRedemptions(); }, 5000);
  
  // Open the web socket for the Chat API
  setTimeout(() => { connectToChat(); }, 5000);
  
  // Keep checking the queue
  state.timers.queues.adverts = setInterval(onQueueAdvertCheck, 1000);
  state.timers.queues.emoteonly = setInterval(onQueueEmoteOnlyCheck, 1000);
  state.timers.queues.timeouts = setInterval(onQueueTimeoutCheck, 1000);
  
  // Create audio element and set volume
  audio = document.createElement('audio');
  audio.onended = onAudioEnded;
  audio.error = onAudioEnded;
  audio.volume = global.volume;
}

/* AUDIO EVENT */
function onAudioEnded() {
  console.log('[SLASH-BOT] - Audio Ended');
  
  state.playing.timeouts = false;
  audio.setAttribute('src', null);
}

/* ADVERT QUEUE EVENT */
function onQueueAdvertCheck() {
  // If we're not currently playing an advert and there is one in the queue
  if (!state.playing.adverts && state.queues.adverts.length > 0 && chatServer != null) {
    let event = state.queues.adverts.shift();
    
    console.log(`[SLASH-BOT] - Playing ${event.duration}s Advert...`);
    console.log(event);
    
    state.playing.adverts = true;
    
    // Send command and response
    sendChatMessage(`/commercial ${event.duration}`);
    
    // Send response if one exists
    if (event.response)
    	sendChatMessage(event.response.replace('{user}', event.user).replace('{duration}', event.duration));
    
    // Wait duration for advert to end
    setTimeout(function() {
      console.log('[SLASH-BOT] - Advert ended');
      state.playing.adverts = false;
    }, (event.duration + 5) * 1000);
  }
}

/* EMOTE-ONLY QUEUE EVENT */
function onQueueEmoteOnlyCheck() {
  // If there is an item in the queue
  if (state.queues.emoteonly.length > 0) {
    let event = state.queues.emoteonly.shift();
    
    // If we're not currently in emote-only mode, start it
    if (!state.playing.emoteonly) {
      
      state.playing.emoteonly = true;
      
      // Start emote only mode
      sendChatMessage(`/emoteonly`);
      
      // Send response if one exists
      if (global.emoteonly.responses.started)
      	sendChatMessage(global.emoteonly.responses.started.replace('{user}', event.user).replace('{duration}', event.duration));
      
      // Start timer
      state.timers.emoteonly = setTimeout(onEmoteOnlyEnded, event.duration * 1000);
    }
    else {
      // Send response if one exists
      if (global.emoteonly.responses.continued)
      	sendChatMessage(global.emoteonly.responses.continued.replace('{user}', event.user).replace('{duration}', event.duration));
      
      // Extend duration
      state.emoteonly_extend += event.duration;
    }
  }
}

/* TIMEOUT QUEUE EVENT */
function onQueueTimeoutCheck() {
  // If we're not currently playing something and there is a queued person
  if (!state.playing.timeouts && state.queues.timeouts.length > 0 && chatServer != null) {
    let event = state.queues.timeouts.shift();
    
    // Send the chat command if available
    console.log('[SLASH-BOT] - Timing out: ' + event.target);
    
    state.playing.timeouts = true;
    
    // Send the timeout command
    sendChatMessage('/timeout @' + event.target + ' ' + event.duration);
    
    // Send response if one exists
    if (event.response)
    	sendChatMessage(event.response.replace('{target}', event.target).replace('{user}', event.sender));
    
    // Play audio cue if one exists
    if (event.sound) {
      audio.setAttribute('src', event.sound);
      audio.play();
    }
    else
      state.playing.timeouts = false;
  }
}

function onEmoteOnlyEnded() {
  // Check to see if we need to extend the timer
  if (state.emoteonly_extend > 0) {
    // Restart the timer with extended duration
    state.timers.emoteonly = setTimeout(onEmoteOnlyEnded, state.emoteonly_extend * 1000);
    state.emoteonly_extend = 0;
  }
  else {
    // Turn off emote-only chat
    sendChatMessage('/emoteonlyoff');
    state.playing.emoteonly = false;
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
  console.log('[SLASH-BOT] - Redemptions server open!');
  
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
  console.log('[SLASH-BOT] - Redemptions server closed!');
  
  clearInterval(state.timers.ping);
  clearTimeout(state.timers.timeout);
  
  // Reconnect after 10s
  console.log('[SLASH-BOT] - Attempting redemptions reconnect in 10s...');
  setTimeout(() => { connectToRedemptions(); }, 10000);
}

function onRedemptionsError(obj) {
  console.log('[SLASH-BOT] - Redemptions server error!');
  
  // Disconnect from the server
  redemptionsServer.close();
}

function onRedemptionsMessage(obj) {
  console.log('[SLASH-BOT] - Redemptions message received!');
  
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
        
        if (global.adverts[title] != null) {
          // If it matches an Advert reward
          let ad = global.adverts[title];
          
          console.log(`[SLASH-BOT] - ${ad.duration}s advert redeemed by ${redemption.user.login}`);
          
          // Create advert event
          let advert = {
            "duration": ad.duration,
            "response": ad.response,
            "user": redemption.user.login
          }
          
          // Add to queue
          state.queues.adverts.push(advert);
        }
        else if (title == global.emoteonly.name) {
          // If it matches the emote-only reward
          console.log(`[SLASH-BOT] - Emote-Only Chat redeemed by: ${redemption.user.login}`);
          
          let emoteonly = {
            "duration": global.emoteonly.duration,
            "user": redemption.user.login
          }
          
          state.queues.emoteonly.push(emoteonly);
        }
        else if (title == global.timeouts.other.name || title == global.timeouts.self.name) {
          // If it matches a timeout reward
          console.log(`[SLASH-BOT] - Timeout redeemed by: ${redemption.user.login}`);
          
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
          state.queues.timeouts.push(timeout);
        }
      }
  	}
    else if (response.type == "RECONNECT") {
      // If the server is asking us to reconnect
      console.log('[SLASH-BOT] - Redemptions server reconnect requested!');
      redemptionsServer.close();
    }
    else if (response.type == "PONG") {
      // Stop the timeout timer
      console.log('[SLASH-BOT] - Redemptions server pong received!');
      clearTimeout(state.timers.timeout);
    }
  }
  else
    redemptionsServer.close();
  
}

function onRedemptionsPing() {
  console.log('[SLASH-BOT] - Pinging Redemptions server...');
  
  // Send a ping to the server
  redemptionsServer.send(JSON.stringify({ "type": "PING" }));
  
  // Start the timeout timer for PONG
  state.timers.timeout = setTimeout(onRedemptionsTimeout, 10000);
}

function onRedemptionsTimeout() {
  console.log('[SLASH-BOT] - Redemptions server timed out!');
  
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
  console.log('[SLASH-BOT] - Chat open!');
  
  // Send auth information
  chatServer.send('PASS oauth:' + global.chat.oauth);
  chatServer.send('NICK ' + global.chat.name);
}

function onChatClosed(obj) {
  console.log('[SLASH-BOT] - Chat closed!');
  
  // Set the websocket to null
  chatServer = null;
  
  // Wait to reconnect
  console.log('[SLASH-BOT] - Attempting chat reconnect in 10s...');
  setTimeout(() => { connectToChat(); }, 10000); 
}

function onChatError(obj) {
  console.log('[SLASH-BOT] - Chat error!');
  
  // Close the websocket
  chatServer.close();
}

function onChatMessage(obj) {
  console.log('[SLASH-BOT] - Chat message received!');
  
  // Tell server we are still connected
  if (obj.data.startsWith('PING')) {
    console.log('[SLASH-BOT] - Sending PONG...');
    chatServer.send('PONG :tmi.twitch.tv');
  }
  
  let prefix = obj.data.split('tmi.twitch.tv')[1].replace(' ', '');
  
  if (prefix.startsWith('001')) {
    // Connected, so join channel
    console.log('[SLASH-BOT] - Chat connection successful!');
    chatServer.send('JOIN #' + global.channel.name);
  }
  else if (prefix.startsWith('421')) {
    console.log('[SLASH-BOT] - 421');
    console.log(obj.data);
  }
  else if (prefix.startsWith('NOTICE')) {
    // If chat credentials are invalid
    console.log('[SLASH-BOT] - Chat credentials invalid!');
    
    // Close the websocket
    chatServer.close();
  }
  else if (prefix.startsWith('JOIN')) {
    // We have successfully connected to chat
    console.log('[SLASH-BOT] - Joined chat for: ' + global.channel.name);
    if (global.chat.connected)
    	sendChatMessage(global.chat.connected);
  }
}

/* WIDGET EVENT */
function onWidgetLoaded(obj) {
  console.log('[SLASH-BOT] - Widget loaded!');
  
  initialize(obj);
  start();
}
