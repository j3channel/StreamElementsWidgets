# HOW TO: INTEGRATE YOUR CHANNEL POINTS
After you have pasted the code into StreamElements, you need to grant them access to the PubSub API to allow integration with Channel Points.

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Scroll down to the 'Helix' section and set *channel:read:redemptions* to 'Yes'.
3. Click 'Generate Token' at the bottom
4. Ensure you are signed in with the **Twitch account you will be streaming from**.
5. Allow access in the authentication window.
6. Copy the generated 'Access Token' field
7. Open the *API* section of the widget in StreamElements.
8. Paste the access code into the *OAuth* field.

# SELECT YOUR CHANNEL POINT REDEMPTIONS
You will need to tell the Widget which redemption should play which file.

1. Go to the *Redemptions* section of the widget in StreamElements.
2. Set the *Redemption Name* field to the **exact name of the redemption** you would like to hook it to.
3. Set *Video* to the file you wish for the redemption to play.
4. Give it a test!

# ADDING MORE REDEMPTIONS
By default I've allowed for up to 10 redemptions. If you need more, follow these instructions:

1. Go to *Settings -> Open Editor -> FIELDS* of the widget in StreamElements.
2. Copy the contents of the *add_redemption.json* file.
3. Paste it directly after the last 'redemption_audio_' node in the *FIELDS* tab.
4. Replace the 'X' in *both* node names with the next number. (E.g. replace X with 11 if the last number in the list is 10)
5. Click 'DONE'.
6. Check your *Settings -> Redemptions* section and a new slot should be available.
