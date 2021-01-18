let global = {
  "channel": "", // Channel name
  "duration": 5, // Duration to show the greeting for
  "ignore": [], // Users to ignore
  "messages": [], // Messages to display
  "refresh_rate": 1 // How often to check the queue
}

let state = {
  "queue": [],
  "showing": false,
  "users": [],
};

// Widget load event listener
window.addEventListener('onWidgetLoad', function (obj) {
  console.log("[GREETER] - Widget Loaded!");
  
  initialize(obj);
  start();
});

// Widget event received listener
window.addEventListener('onEventReceived', function (obj) {
  // If the event is a message
  if (obj.detail.listener == "message") {
    let message = obj.detail.event.data;
    
    // If the username hasn't been greeted and it's not a user to ignore
    if (!state.users.includes(message.nick) && !global.ignore.includes(message.nick))
    {
      state.users.push(message.nick);
      
      let event = {
        "nickname": message.nick,
        "username": message.displayName,
        "text": global.messages[Math.floor(Math.random() * global.messages.length)] // Select random message
      };
      
      state.queue.push(event);
      return;
    }
  }
});

function initialize(obj) {
  console.log("[GREETER] - Initializing...");
  
  let fieldData = obj.detail.fieldData;
  
  // Global Settings
  global.channel = obj.detail.channel.username;
  global.duration = fieldData.duration;
  global.ignore = fieldData.ignore.toLowerCase().split(' ');
  
  // Set Messages
  let messages = Object.getOwnPropertyNames(fieldData).filter(m => m.includes('welcome_message_'));
  for (let i = 0; i < messages.length; i++) {
    // Add messages to list (if they exist)
    let msg = fieldData[messages[i]];
    if (msg)
    	global.messages.push(msg);
  }
  
  console.log(global.messages);
}

function start() {
  console.log("[GREETER] - Widget starting...");

  // Set refresh clock
  setInterval(onQueueCheck, global.refresh_rate * 1000);
}

function onQueueCheck() {
  // If we're not showing a message and there's a user in the queue...
  if (!state.showing && state.queue.length > 0) {
    console.log("[GREETER] - Showing message!");
    let event = state.queue.shift();

    $('.main-container span').html(event.text.replace('{name}', '<span class="accent">' + event.username + '</span>'));
    $('.main-container').animate({ 'opacity': 1 }, function() {
      // Wait the duration before hiding again
      setTimeout(function() {
        // Fade out and finish
        $('.main-container').animate({ 'opacity': 0 }, function() {
          // Flag ready for next message
          setTimeout(function() { state.showing = false; }, global.refresh_rate * 1000);
        });
        
      }, global.duration * 1000);
    });
    
    state.showing = true;
  }
}
