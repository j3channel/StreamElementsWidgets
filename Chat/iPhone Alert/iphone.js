let global = {
  "duration": 0,
  "channel": {
    "id": "",
    "name": ""
  },
  "sound": {}
}

let state = {
  "ignore": [],
  "queue": [],
  "showing": false,
  "timers": {
    "queue": 0
  }
}

window.addEventListener("onWidgetLoad", onWidgetLoaded);
window.addEventListener("onEventReceived", onWidgetEventReceived);

function initialize(obj) {
  console.log("[IPHONE ALERT] - Initializing...");
  
  let fieldData = obj.detail.fieldData;
  
  /* Global Settings */
  global.channel.id = obj.detail.channel.providerId;
  global.channel.name = obj.detail.channel.username;
  global.duration = fieldData["duration"];
  
  /* Set UI */
  $('.app').html(fieldData["name"]);
  
  // Set sound if one exists
  let sound = fieldData["sound"];
  if (sound) {
    global.sound = document.createElement('audio');
    global.sound.setAttribute('src', sound);
    global.sound.volume = fieldData["volume"] / 100;
  }
  
  // Convert ignore list to lower case
  let toIgnore = fieldData["ignore"].split(' ');
  for(let i = 0; i < toIgnore.length; i++) {
    state.ignore.push(toIgnore[i].toLowerCase());
  }
  
  // Ignore own channel name
  state.ignore.push(global.channel.name);
}

function start() {
  console.log("[IPHONE ALERT] - Starting...");
  
  let height = $('.container').outerHeight();
  $('.container').animate({'top': `-${height}px`}, 500, function() {
    $(this).css({'opacity': 1});
  });
  
  // Check queue every second
  state.timers.queue = setInterval(onQueueCheck, 1000);
}

function onQueueCheck() {
  // Is there an item in the queue and are we already showing a message?
  if (state.queue.length > 0 && !state.showing) {
    console.log("[IPHONE ALERT] - Showing message...");
    
    // Get first message in queue and block any further messages
    let next = state.queue.shift();
    state.showing = true;
    
    // Set text
    $('.sender').html(next.sender);
    $('.message').html(next.message);
    
    // Animate in and out
    let height = $('.container').outerHeight();
    $('.container').animate({'top':'0px'}, 500).delay(global.duration * 1000).animate({'top':`-${height}px`}, 500, function() {
      console.log("[IPHONE ALERT] - Hiding message...");
      state.showing = false;
    });
    
    // Play the sound if one exists
    if (global.sound) {
      global.sound.play();
    }
  }
}

function onWidgetLoaded(obj) {
  console.log("[IPHONE ALERT] - Widget loaded!");
  
  initialize(obj);
  start();
}

function onWidgetEventReceived(obj) {
  console.log("[IPHONE ALERT] - Event received!");
  console.log(obj);
  
  // If the event is a message
  if (obj.detail.listener == "message") {
    let event = obj.detail.event;
    if (!state.ignore.includes(event.data.nick)) {
      console.log("[IPHONE ALERT] - New chatter! Adding to queue...");
      
      // Add username to ignore list
      state.ignore.push(event.data.nick);
      
      // Create new message object and add to queue
      state.queue.push({"message": event.renderedText, "sender": event.data.displayName });
    }
  }
}
