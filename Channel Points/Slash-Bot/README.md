# Slash-Bot
A widget that will automatically perform Twitch Chat */commands* when Channel Point Rewards are redeemed.

Full instructions to add the widget to your overlay, connect it to Twitch and set up the redemptions are below.

**Commercials** - Run a 30/60/90/120/150/180 second advert on your channel. You can have up to *three* different advert channel point rewards. *E.g One for 30s, one for 60s and one for 90s.*

**Emote-Only Chat** - Will turn on Emote-Only Chat mode for a specified length of time before turning it back off again. If this is redeemed while the timer is already running, extra time will be added to the current emote-only chat mode.

**Timeout Self** - Will time out the user that redeemed the reward for a specified amount of time.

**Timeout Other** - Will time out a user of the redeemer's choice *(excluding the broadcaster)* for a specified amount of time.

## HOW TO ADD TO YOUR OVERLAY
To add this widget to your overlay, follow these steps:

1. Go to StreamElements, sign in and go to *My Overlays* in the left-hand menu.
2. Click *Edit* on an existing overlay you would like to add this widget to **or** select *Create Blank Overlay* in the top-right.
3. Click the circular *+* button at the bottom of the screen and select *Static / Custom* -> *Custom Widget*
4. Click the new widget that has appeared in your overlay and click *Settings* in the left-hand menu.
5. Click *Open Editor*
6. Delete *all* of the code in the **HTML** tab.
7. Delete *all* of the code in the **CSS** tab.
8. Replace *all* of the code in the **JS** tab with the code inside the *iphone.js* file in this repository.
9. Replace *all* of the code in the **Fields** tab with the code inside the *iphone.json* file in this repository.
10. Delete *all* of the code inside the **Data** tab.
11. Click *Done* in the bottom-right.

## CONNECT THE WIDGET TO TWITCH
This widget will need to use a Twitch Bot account that can be granted access to your channel's Twitch Chat *and* Channel Point Redemptions. If you do not already own one, create one for free by just creating another Twitch Account. Your bot account will require **Moderator and Editor Privileges**. You can apply these through your channel's Twitch Creator Dashboard under **Community** -> **Roles Manager**.

*NOTE: Users will NOT be able to time-out other moderators for your channel.*

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the **Helix** category, change **channel:read:redemptions** to **Yes** and everything else to **No**.
3. Click **Generate** at the bottom of the page.
4. When asked to authenticate, make sure you are logged in with **YOUR TWITCH STREAMING ACCOUNT** and click **Allow**.
5. Copy the **Access Token** it provides you and head back to this widget in your StreamElements overlay.
6. Click the widget and select **Settings** in the left-hand menu.
7. Under the **Settings** drop-down that appears, paste your access token into the **Redemptions OAuth Token** field.
8. Go back to https://twitchtokengenerator.com and select **Custom Scope**.
9. Under the **v5** category, change **chat_login** to **Yes** and everything else to **No**.
10. Click **Generate** at the bottom of the page.
11. When asked to authenticate, make sure you are logged in with **YOUR TWITCH BOT ACCOUNT** and click **Allow**.
12. Copy the **Access Token** it provides and head back to this widget in your StreamElements overlay.
13. Click the widget and select **Settings** in the left-hand menu.
14. Under the **Settings** drop-down that appears, paste your access token into the **Chatbot OAuth Token** field.
15. In the **ChatBot Name** field, type your chatbot's Twitch username.
16. If successful, you should see *Slash-Bot Connected!* appear in your channel's chat.

## LINKING YOUR CHANNEL POINT REWARDS
Click on the widget in your StreamElements overlay and click the **Settings** option in the left-hand menu. This will display a list of settings below to help customise which redemptions to listen out for and what they will do.

### Commercials
You can set up to three different rewards to handle three different commercial lengths. If you don't need any, just leave the **Channel Points Name** field blank of any you do not require.

**Channel Points Name** - The *exact* name of the channel point reward to trigger a commercial. *NOTE: Can be left blank if not required*.

**Advert Length** - Length (30/60/90/120/150/180 seconds) of the commercial to run.

**Response** - Response to write in chat when the commercial is played. *NOTE: Can be left blank if not required.*

### Emote-Only Chat
This will start - or continue, if already in - emote-only mode in your channel's chat.

**Channel Points Name** - The *exact* name of the channel point reward to trigger emote-only chat. *NOTE: Can be left blank if not required*.

**Duration** - Length (in seconds) to enable Emote-Only chat for.

**Response if Continued** - Response to write in chat when the emote-only mode is already enabled and is extended.

**Response if Started** - Response to write in chat when emote-only mode is started.

### Timeout Self
This will time out the user that redeemed the channel point reward. As per Twitch's functionality, this will be unable to time out other moderators.

**Channel Points Name** - The *exact* name of the channel point reward to trigger the time-out. *NOTE: Can be left blank if not required*.

**Response** - Response to write in chat when the timeout occurs. *NOTE: Can be left blank if not required.*

**Duration** - Length (in seconds) to time out the user for.

**Sound** - Sound to play when the timeout occurs. *NOTE: Can be left blank if not required.*

### Timeout Other
This will time out a user that the redeemer specifies in the reward redemption. As per Twitch's functionality, this will be unable to time out other moderators. 

*NOTE: For this to work you will need to turn on **Require Viewer to Enter Text** for your Channel Point Reward. To do this, go to your Twitch Creator Dashboard and go to **Viewer Rewards** -> **Channel Points** -> **Manage Rewards & Challenges**. Click **Edit** on your reward and tick the **Require Viewer to Enter Text** check-box and click **Save**.

**Channel Points Name** - The *exact* name of the channel point reward to trigger the time-out. *NOTE: Can be left blank if not required*.

**Response** - Response to write in chat when the timeout occurs. *NOTE: Can be left blank if not required.*

**Duration** - Length (in seconds) to time out the user for.

**Sound** - Sound to play when the timeout occurs. *NOTE: Can be left blank if not required.*
