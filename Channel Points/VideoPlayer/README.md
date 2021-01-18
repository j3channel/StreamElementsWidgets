# SELECT YOUR CHANNEL POINT REDEMPTIONS
You will need to tell the Widget which redemption should play which file.

1. Go to the 'Settings' -> 'Redemptions' tab of the widget in StreamElements
2. Type in the *exact* name of the Channel Point Redemption name you want to use.
3. Under 'Redemption Name' type the *exact* name of the redemption you would like to play a file. Type the name exactly as it appears in the Twitch Chat channel points redemption menu.
4. Under 'Set Video' or 'Set Sound', find the file you wish for the redemption to play.
5. Give it a test!

# ADDING MORE REDEMPTIONS
By default I've allowed for up to 10 redemptions. If you need more, follow these instructions:

1. Go to 'Settings' -> 'Open Editor' -> 'FIELDS'
2. Copy the contents of the *add_redemption.json* file.
3. Paste it directly after the last 'redemption_audio_' node in the 'FIELDS' tab.
4. Replace the 'X' in *both* node names with the next number. (E.g. replace X with 11 if the last number in the list is 10)
5. Click 'DONE'.
6. Check your 'Settings' -> 'Redemptions' tab and a new slot should be available.
