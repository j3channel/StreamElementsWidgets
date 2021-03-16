# SEQUENCE CHATBOT
This widget will allow a bot to respond to a sequence of trigger phrases, then play a sound when the sequence has finished.


# OAUTH KEYS SETUP
You will need an OAuth key to allow your bot to respond in chat.

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the 'v5' category change *chat_login* to 'Yes'.
3. Scroll down and click **Generate**.
4. Ensure you are logged in with your **Bot's Twitch Account** and allow access.
5. Copy the **Access Token**.
6. Go to your StreamElements overlay, select the widget and use the **Settings** drop-down on the left of the screen.
7. Paste the access token into the *Bot* -> *Bot OAuth* field.
8. Set the *Bot* -> *Bot Username* to your **bot's Twitch username**.

## SETTINGS
Additional configurable settings for the Widget. 
These are accessed by going to your StreamElements Overlay containing this widget, then clicking the *Settings* drop-down menu on the left.

### > Bot
**Connected Message** - Message to write in chat when the bot has connected. *(Can be left blank if not required)*

**Bot Username** - The username of the Twitch bot account. *(See instructions above)*

**Bot OAuth** - The OAuth token for the twitch bot account. *(See instructions above)*

### > Sequence
**Trigger** - Phrase that will trigger the next **Reply**. *(Can be left blank if not required)*

**Reply** - The message the bot will reply with when the above **Trigger** is detected. *(Can be left blank if not required)*

**End Sound** - The sound to be played when the end of the sequence is reached. *(Can be left blank if not required)*

### > Settings
**Cooldown** - How many minutes to be on cooldown before allowing the sequence to start again.

**Cooldown End Message** - Write a message in chat when the cooldown has ended. *(Can be left blank if not required)*

**Audio Volume** - Volume of the sound player
