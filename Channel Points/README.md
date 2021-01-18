# HOW TO: ADD TO YOUR OVERLAY
To use these Widgets please do the following:

1. Go to the Overlay you would like to use in your StreamElements account
2. In the bottom left click '+' -> 'Static/Custom' -> 'Custom Widget'
3. Click the new Widget and go to 'Settings' -> 'Open Editor' in the left-hand bar
4. Replace ALL text in the HTML tab with the .html file
5. Replace ALL text in the CSS tab with the .css file
6. Replace ALL text in the JS tab with the .js file
7. Replace ALL text in the FIELDS tab with the .json file
8. Click 'DONE' in the bottom-right.
9. Use the left-hand bar 'Settings' to customise the widget to your own needs.
10. You'll now need to **Integrate your Channel Points**, so read the instructions below.

# HOW TO: INTEGRATE YOUR CHANNEL POINTS
After you have pasted the code into StreamElements, you need to grant them access to the PubSub API to allow integration with Channel Points.

1. Go to https://twitchtokengenerator.com (shoutout to SwiftySpiffy for making this!)
2. Allow the website access to the Twitch Account you will be using for your StreamElements widgets.
3. Click 'Custom Scope Token'
4. Scroll down to 'Helix' and tick 'YES' only on 'channel:read:redemptions'. Make sure all others are at 'NO'
5. Click 'Generate Token' at the bottom
6. Copy the generated 'Access Token' field
7. Paste this into the 'Settings' -> 'API' tab of the Widget in StreamElements (in the left-hand bar).
