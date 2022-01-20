let config = {
  "channel": {
    "id": "",
    "username": "",
  },
  "chatbot": {
    "oauth": "",
    "reconnect": 0,
    "response": "",
    "username": "",
    "websocket": null
  },
  "items": [],
  "redemptions": {
    "oauth": "",
    "ping": 0,
    "pong": 0,
    "reconnect": 0,
    "name": "",
    "websocket": null
  }
};


let state = {
  "index": 0,
  "items": []
};


window.addEventListener('onWidgetLoad', onWidgetLoad);
function onWidgetLoad(obj) {
  console.log('[SHUFFLER v1] - Widget Loaded');
  
  // Initialise config
  initialise(obj);
  
  // Delay widget start by 5 seconds
  setTimeout(start, 5 * 1000);
}


function initialise(obj) {
  console.log('[SHUFFLER v1] - Initialising...');
  
  fieldData = obj.detail.fieldData;
  
  /* Channel Settings */
  config.channel.id = obj.detail.channel.providerId;
  config.channel.username = obj.detail.channel.username;
  
  /* Chatbot Settings */
  config.chatbot.oauth = fieldData["chat_token"];
  config.chatbot.response = fieldData["chat_response"];
  config.chatbot.username = fieldData["chat_username"];
  
  /* Channel Points Settings */
  config.redemptions.oauth = fieldData["redemptions_token"];
  config.redemptions.name = fieldData["redemptions_name"];
  
  /* Items Settings */
  config.items = fieldData["items"].split(',');
}

function start() {
  /* Retrieve Previous State */
  SE_API.store.get('SHUFFLER-V1-STATE').then(last => {
    if (last != undefined) 
      state = last;
    
    console.log(`[SHUFFLER v1] - ${state.items.length} items found from previous state.`);
    
    // If arrays don't match or previous state contains no items
    let match = compareArray(state.items, config.items);
    if (!match || state.items.length == 0) {
      console.log('[SHUFFLER v1] - Items list changed. Overwriting...');
      
      // Shuffle items and store in state
      state.index = 0;
      state.items = shuffleArray(config.items);
      
      // Store new state as array has changed
      SE_API.store.set('SHUFFLER-V1-STATE', state);
    }
    
    console.log(`[SHUFFLER v1] - Item count: ${state.items.length}`);
  	console.log(`[SHUFFLER v1] - Index: ${state.index}`);
  });
  
  /* Connect to Chat */
  connectToChat();
  
  /* Connect to Redemptions PubSub */
  connectToRedemptions();
}


function compareArray(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  
  // Copy first array and sort
  let aCopy = a.slice(0);
  aCopy.sort();
  
  // Copy second array and sort
  let bCopy = b.slice(0);
  bCopy.sort();
  
  for (var i = 0; i < a.length; i++) {
    if (aCopy[i] !== bCopy[i]) return false;
  }
  
  return true;
}


function shuffleArray(array) {
  let copy = array.slice(0);
  
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  
  return copy;
}


function moveToNext(username) {
  // Get item and compile message
  let item = state.items[state.index];
  let msg = config.chatbot.response.replace('{item}', item).replace('{user}', username);
  
  console.log(`[SHUFFLER v1] - Item '${item}' at index ${state.index} selected`);
  
  // Increment index
  state.index++;
  
  // Have we reached the end of the list?
  if (state.index > state.items.length - 1) {
    console.log('[SHUFFLER v1] - Items completed. Re-shuffling...');
    
    // Reset index and re-shuffle list
    state.index = 0;
    state.items = shuffleArray(config.items);
  }

  // Store current state
  SE_API.store.set('SHUFFLER-V1-STATE', state);

  // Send chat message
  sendToChat(msg);
}


/* CHAT CONNECTION */
function connectToChat() {
  console.log('[SHUFFLER v1] - Connecting to chat websocket...');
  
  config.chatbot.websocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
  config.chatbot.websocket.onopen = onChatOpen;
  config.chatbot.websocket.onclose = onChatClose;
  config.chatbot.websocket.onerror = onChatError;
  config.chatbot.websocket.onmessage = onChatMessage;
}


function sendToChat(msg) {
  if (config.chatbot.websocket != null) {
    console.log(`[SHUFFLER v1] - Sending chat message: ${msg}`);
    config.chatbot.websocket.send(`PRIVMSG #${config.channel.username} :${msg}`);
  }
}


function onChatOpen() {
  console.log('[SHUFFLER v1] - Chat websocket open');
  
  // Send auth to login
  config.chatbot.websocket.send(`PASS oauth:${config.chatbot.oauth}`);
  config.chatbot.websocket.send(`NICK ${config.chatbot.username}`);
}


function onChatClose() {
  console.log('[SHUFFLER v1] - Chat websocket closed');
  
  // Attempt reconnect in 5 seconds
  config.chatbot.websocket = null;
  config.chatbot.reconnect = setTimeout(connectToChat, 5 * 1000);
}


function onChatError() {
  console.log('[SHUFFLER v1] - Chat websocket error');
  
  // Close websocket
  config.chatbot.websocket.close();
}


function onChatMessage(obj) {
  if (obj.data.startsWith('PING')) {
    config.chatbot.websocket.send('PONG :tmi.twitch.tv');
    return;
  }
  
  // Separate message prefix
  let prefix = obj.data.split('tmi.twitch.tv')[1].replace(' ', '');
  
  if (prefix.startsWith('001')) {
    // Join channel
    console.log('[SHUFFLER v1] - Chat credentials authenticated');
    config.chatbot.websocket.send(`JOIN #${config.channel.username}`);
  }
  else if (prefix.startsWith('NOTICE')) {
    // Incorrect credentials
    console.log('[SHUFFLER v1] - Chat credentials invalid');
    config.chatbot.websocket.close();
  }
  else if (prefix.startsWith('JOIN')) {
    // Channel joined
    console.log(`[SHUFFLER v1] - Chat channel ${config.channel.username} joined`);
  }
}


/* REDEMPTIONS CONNECTION */
function connectToRedemptions() {
  console.log('[SHUFFLER v1] - Connecting to redemptions websocket...');
  
  config.redemptions.websocket = new WebSocket('wss://pubsub-edge.twitch.tv');
  config.redemptions.websocket.onopen = onRedemptionsOpen;
  config.redemptions.websocket.onclose = onRedemptionsClose;
  config.redemptions.websocket.onerror = onRedemptionsError;
  config.redemptions.websocket.onmessage = onRedemptionsMessage;
}


function onRedemptionsOpen() {
  console.log('[SHUFFLER v1] - Redemptions websocket open');
  
  // Set ping timer
  config.redemptions.ping = setInterval(onRedemptionsPing, 180 * 1000);
  
  // Compile and send listen request
  let request = {
    "type": "LISTEN",
    "data": {
      "topics": [ `channel-points-channel-v1.${config.channel.id}` ],
      "auth_token": config.redemptions.oauth
    }
  };
  
  config.redemptions.websocket.send(JSON.stringify(request));
}


function onRedemptionsClose() {
  console.log('[SHUFFLER v1] - Redemptions websocket closed');
  
  // Clear websocket timers
  clearInterval(config.redemptions.ping);
  clearTimeout(config.redemptions.pong);
  
  // Clear websocker
  config.redemptions.websocket = null;
  
  // Wait to reconnect
  config.redemptions.reconnect = setTimeout(connectToRedemptions, 5 * 1000);
}


function onRedemptionsError() {
  console.log('[SHUFFLER v1] - Redemptions websocket error');
  
  // Close websocket
  config.redemptions.websocket.close();
}


function onRedemptionsMessage(obj) {
  console.log('[SHUFFLER v1] - Redemptions websocket message');
  
  let message = JSON.parse(obj.data);
  
  // Is the message an error?
  if (!message.error) {
    // Message type
    if (message.type == "MESSAGE") {
      let data = JSON.parse(message.data.message);
      
      // Is the message a redemption?
      if (data.type == "reward-redeemed") {
        let redemption = data.data.redemption.reward.title;
        let user = data.data.redemption.user.display_name;
        
        // Does redemption name match?
        if (redemption == config.redemptions.name) {
          console.log(`[SHUFFLER v1] - ${redemption} redemption redeemed`);
          
          // Move to next item
          moveToNext(user);
        }
      }
    }
    else if (message.type == "RECONNECT") {
      console.log('[SHUFFLER v1] - Redemptions reconnect requested');
      config.redemptions.websocket.close();
    }
  }
  else
    config.redemptions.websocket.close();
  
  // Clear pong timer
  clearTimeout(config.redemptions.pong);
}

function onRedemptionsPing() {
  let ping = JSON.stringify({ "type": "PING" });
  config.redemptions.websocket.send(ping);
  
  // Close websocket if no PONG response
  config.redemptions.pong = setTimeout(() => {
    config.redemptions.websocket.close();
  }, 10 * 1000);
}
