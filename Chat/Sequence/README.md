# SEQUENCE CHATBOT
This widget will allow a bot to respond to a sequence of trigger phrases, then play a sound when the sequence has finished.

## HOW TO: ADD THIS WIDGET TO YOUR OVERLAY
To add this widget to your overlay, follow these steps:

1. Go to StreamElements, sign in and go to *My Overlays* in the left-hand menu.
2. Click *Edit* on an existing overlay you would like to add this widget to **or** select *Create Blank Overlay* in the top-right.
3. Click the circular *+* button at the bottom of the screen and select *Static / Custom* -> *Custom Widget*
4. Click the new widget that has appeared in your overlay and click *Settings* in the left-hand menu.
5. Click *Open Editor*
6. Delete *all* of the code in the **HTML** tab.
7. Delete *all* of the code in the **CSS** tab.
8. Replace *all* of the code in the **JS** Tab with the code inside the *sequence.js* file in this repository.
9. Replace *all* of the code in the **Fields** tab with the code inside the *sequence.json* file in this repository.
10. Delete *all* of the code inside the **Data** tab.
11. Click *Done* in the bottom-right.

## HOW TO: CONNECT THE WIDGET TO TWITCH CHAT
This widget will need to use a Twitch Bot account that can be granted access to your channel's Twitch Chat *and* Channel Point Redemptions. If you do not already own one, create one for free by just creating another Twitch Account. Your bot account will require **Moderator and Editor Privileges**. You can apply these through your channel's Twitch Creator Dashboard under **Community** -> **Roles Manager**.

*NOTE: Users will NOT be able to time-out other moderators for your channel.*

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the **v5** category, change **chat_login** to **Yes** and everything else to **No**.
3. Click **Generate** at the bottom of the page.
4. When asked to authenticate, make sure you are logged in with **YOUR TWITCH BOT ACCOUNT** and click **Allow**.
5. Copy the **Access Token** it provides and head back to this widget in your StreamElements overlay.
6. Click the widget and select **Settings** in the left-hand menu.
7. Under the **Bot** drop-down that appears, paste your access token into the **Bot OAuth** field.
8. In the **Bot Username** field, type your chatbot's Twitch username.
9. If successful, you should see *Sequence Bot Connected!* appear in your channel's chat.

## HOW TO: CUSTOMISE THE WIDGET
This widget can be customised to suit your stream. To do this, click on this widget in your StreamElements Overlay, click **Settings** in the left-hand menu and browse the drop-down menus. In case you are unsure what any of the settings do, here is a glossary:

### Bot
**Connected Message** - Message to write in chat when the bot has connected. *(Can be left blank if not required)*

**Bot Username** - The username of the Twitch bot account. *(See instructions above)*

**Bot OAuth** - The OAuth token for the twitch bot account. *(See instructions above)*

### Sequence
**Trigger** - Phrase in chat that will trigger the next **Reply**. *(Can be left blank if not required)*

**Reply** - The message the bot will reply with when the **Trigger** message is detected. *(Can be left blank if not required)*

**End Sound** - The sound to be played when the end of the sequence is reached. *(Can be left blank if not required)*

### Settings
**Cooldown** - Length (in minutes) to be on cooldown before allowing the sequence to start again.

**Cooldown End Message** - Write a message in chat when the cooldown has ended. *(Can be left blank if not required)*

**Audio Volume** - Volume of the sounds.

## HOW TO: ADD MORE TRIGGERS AND REPLIES
By default, you can add up to **five** triggers and replies. If you need more, you can add them by following these instructions:
