// Global settings that won't change
let global = {
  "bot": {
    "connected": "",
    "name": "",
    "oauth": ""
  },
  "channel": {
    "id": "",
    "name": ""
  },
  "cooldown": 0,
  "cooldown_end": "",
  "sequence": {
    "phrases": [],
    "triggers": [],
  },
  "sound": "",
  "volume": 0
};

let state = {
  "cooldown": false,
  "position": 0
};

let audioPlayer = null;
let chatServer = null;

window.addEventListener("onWidgetLoad", onWidgetLoaded);
window.addEventListener("onEventReceived", onWidgetEventReceived);

function onWidgetLoaded(obj) {
  console.log("[SEQUENCE] - Widget loaded!");
  
  Initialize(obj);
  Start(obj);
}

function onWidgetEventReceived(obj) {
  console.log("[SEQUENCE] - Widget event received!");
  console.log(obj);
  
  let type = obj.detail.listener;
  
  // If the event is a chat message and we're not on cooldown
  if (type == "message" && !state.cooldown) {
    console.log("[SEQUENCE] - Message event received!");
    
    // Does the message match the next trigger phrase?
    let text = obj.detail.event.data.text.toLowerCase();
    if (text == global.sequence.triggers[state.position]) {
      console.log("[SEQUENCE] - Text Match!");
      
      // Respond with correct phrase
      SendChatMessage(global.sequence.phrases[state.position].replace('{user}', `${obj.detail.event.data.displayName}`));
      
      // Increment the position
      state.position++;
      if (state.position >= global.sequence.triggers.length) {
        console.log("[SEQUENCE] - Sequence finished!");
        
        // Play sound and set cooldown
        state.cooldown = true;
        state.position = 0;
        
        // Play sound if one exists
        if (global.sound) {
          audioPlayer.setAttribute('src', global.sound);
          audioPlayer.play();
        }
        
        // Set timeout to remove cooldown
        setTimeout(() => { 
          state.cooldown = false;
          
          // Send cooldown end message if applicable
          if (state.cooldown_end)
          	SendChatMessage(state.cooldown_end);
          
        }, (global.cooldown * 60) * 1000);
      }
    }
  }
}

function Initialize(obj) {
  console.log("[SEQUENCE] - Initializing...");
  let fieldData = obj.detail.fieldData;
  
  // Set the bot settings
  global.bot.connected = fieldData["bot_connected"];
  global.bot.name = fieldData["bot_name"];
  global.bot.oauth = fieldData["bot_oauth"];
  
  // Set Channel Settings
  global.channel.id = obj.detail.channel.providerId;
  global.channel.name = obj.detail.channel.username;
  global.channel.oauth = obj.detail.channel

  // Set other settings
  global.cooldown = fieldData["cooldown"];
  global.sound = fieldData["sound"];
  global.volume = fieldData["volume"] / 100;
  
  // Get all phrases
  let phrases = Object.getOwnPropertyNames(fieldData).filter(p => p.includes('phrase'));
  for (let i = 0; i < phrases.length; i++) {
    // Add all the phrases to the list
    if (fieldData[`phrase_${i}`])
    	global.sequence.phrases.push(fieldData[`phrase_${i}`]);
  }
  
  // Get all triggers
  let triggers = Object.getOwnPropertyNames(fieldData).filter(t => t.includes('trigger'));
  for (let i = 0; i < triggers.length; i++) {
    // Add all the triggers to the list
    if (fieldData[`trigger_${i}`])
    	global.sequence.triggers.push(fieldData[`trigger_${i}`].toLowerCase());
  }
}

function Start() {
  console.log("[SEQUENCE] - Widget starting!");
  
  audioPlayer = document.createElement('audio');
  audioPlayer.volume = global.volume;
  
  // Wait to connect to chat
  setTimeout(() => { ConnectToChat(); }, 5000);
}

function SendChatMessage(msg) {
  if (chatServer != null)
    chatServer.send(`PRIVMSG #${global.channel.name} :${msg}`);
}

function ConnectToChat() {
  console.log("[SEQUENCE] - Connecting to Chat Websocket...");
  
  // Connect to the chat websocket
  chatServer = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
  chatServer.onopen = onChatOpen;
  chatServer.onclose = onChatClosed;
  chatServer.onerror = onChatError;
  chatServer.onmessage = onChatMessage;
}

function onChatOpen() {
  console.log("[SEQUENCE] - Chat WebSocket open! Authenticating...");
  
  // Pass the WebSocket the oauth information
  chatServer.send(`PASS oauth:${global.bot.oauth}`);
  chatServer.send(`NICK ${global.bot.name}`);
}

function onChatError() {
  console.log("[SEQUENCE] - Chat WebSocket error!");
  
  // Close the WebSocket
  chatServer.close();
}

function onChatMessage(obj) {
  console.log("[SEQUENCE] - Chat WebSocket message!");
  
  // Tell the server we are still connected
  if (obj.data.startsWith('PING')) {
    console.log("[SEQUENCE] - Sending ping...");
    chatServer.send('PONG :tmi.twitch.tv');
  }
  
  // Get prefix of received message
  let prefix = obj.data.split('tmi.twitch.tv')[1].replace(' ', '');
  if (prefix.startsWith('001')) {
    console.log("[SEQUENCE] - Chat Connection Successful!");
    chatServer.send(`JOIN #${global.channel.name}`);
  }
  else if (prefix.startsWith('421')) {
    console.log("[SEQUENCE] - 421");
    console.log(obj.data);
  }
  else if (prefix.startsWith('NOTICE')) {
    console.log("[SEQUENCE] - Chat credentials invalid!");
    
    // Credentials invalid, close connection
    chatServer.close();
  }
  else if (prefix.startsWith('JOIN')) {
    console.log(`[SEQUENCE] - Joined chat for channel ${global.channel.name}`);
    if (global.bot.connected)
      SendChatMessage(global.bot.connected);
  }
}

function onChatClosed() {
  console.log("[SEQUENCE] - Chat WebSocket closed!");
  
  // Await reconnect to WebSocket
  chatServer = null;
  setTimeout(() => { ConnectToChat(); }, 10000);
}
