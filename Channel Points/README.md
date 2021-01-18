#HOW TO INTEGRATE CHANNEL POINTS
After you have pasted the code into StreamElements, you need to grant them access to the PubSub API to allow integration with Channel Points.

1. Go to https://twitchtokengenerator.com (shoutout to SwiftySpiffy for making this!)
2. Allow the website access to the Twitch Account you will be using for your StreamElements widgets.
3. Click 'Custom Scope Token'
4. Scroll down to 'Helix' and tick 'YES' only on 'channel:read:redemptions'. Make sure all others are at 'NO'
5. Click 'Generate Token' at the bottom
6. Copy the generated 'Access Token' field
7. Paste this into the 'Settings' -> 'API' tab of the Widget in StreamElements (in the left-hand bar).

#SELECT YOUR CHANNEL POINT REDEMPTIONS
After you have done the above, you will need to tell the Widget which redemption should play which file.

1. Go to the 'Settings' -> 'Redemptions' tab of the widget in StreamElements
2. Type in the *exact* name of the Channel Point Redemption name you want to use.
3. Under 'Redemption Name' type the *exact* name of the redemption you would like to play a file. Type the name exactly as it appears in the Twitch Chat channel points redemption menu.
4. Under 'Set Video' or 'Set Sound', find the file you wish for the redemption to play.
5. Give it a test! It should now play it.

#ADDING MORE REDEMPTIONS
By default I've allowed up to 10 redemptions for each widget. If you need more, follow these instructions:

1. Go to 'Settings' -> 'Open Editor' -> 'FIELDS'
2. Copy the following:

### Audio
"redemption_name_X": {
    "type": "text",
    "label": "Redemption Name",
    "value": "",
    "group": "Redemptions"
  },
  "redemption_audio_X": {
    "type": "video-input",
    "label": "Redemption Video",
    "value": "",
    "group": "Redemptions"
  },
  
  ### Video
  "redemption_name_X": {
    "type": "text",
    "label": "Redemption Name",
    "value": "",
    "group": "Redemptions"
  },
  "redemption_audio_X": {
    "type": "video-input",
    "label": "Redemption Video",
    "value": "",
    "group": "Redemptions"
  },

3. Paste it after the last node(s) of the same name in the FIELDS tab
4. Replace the 'X' in BOTH these node names with the next number in the sequence. For example, if the last set is 'redemption_name_10' replace the X's with '11'
5. Click 'DONE'.
6. The Redemptions tab should now have another slot available.
