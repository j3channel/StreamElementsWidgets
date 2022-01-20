# SHUFFLER
A widget that will write in chat with a randomly selected item from a list when a channel point reward is redeemed.

This widget will ensure all items are selected once before re-shuffling the list.

Full instructions to add the widget to your overlay, connect it to Twitch and set up the redemptions are below.

## HOW TO ADD TO YOUR OVERLAY
To add this widget to your overlay, follow these steps:

1. Go to StreamElements, sign in and go to *My Overlays* in the left-hand menu.
2. Click *Edit* on an existing overlay you would like to add this widget to **or** select *Create Blank Overlay* in the top-right.
3. Click the circular *+* button at the bottom of the screen and select *Static / Custom* -> *Custom Widget*
4. Click the new widget that has appeared in your overlay and click *Settings* in the left-hand menu.
5. Click *Open Editor*
6. Delete *all* of the code in the **HTML** tab.
7. Delete *all* of the code in the **CSS** tab.
8. Replace *all* of the code in the **JS** tab with the code inside the *shuffler.js* file in this repository.
9. Replace *all* of the code in the **Fields** tab with the code inside the *shuffler.json* file in this repository.
10. Replace *all* of the code inside the **Data** tab with: {}
11. Click *Done* in the bottom-right.

## CONNECT THE WIDGET TO TWITCH
This widget will need to use a Twitch Bot account that can be granted access to your channel's Twitch Chat *and* Channel Point Redemptions. If you do not already own one, create one for free by just creating another Twitch Account. Your bot account will require **Moderator and Editor Privileges**. You can apply these through your channel's Twitch Creator Dashboard under **Community** -> **Roles Manager**.

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the **Helix** category, change **channel:read:redemptions** to **Yes** and everything else to **No**.
3. Click **Generate** at the bottom of the page.
4. When asked to authenticate, make sure you are logged in with **YOUR TWITCH STREAMING ACCOUNT** and click **Allow**.
5. Copy the **Access Token** it provides you and head back to this widget in your StreamElements overlay.
6. Click the widget and select **Settings** in the left-hand menu.
7. Under the **Channel Points** drop-down that appears, paste your access token into the **OAuth Token** field.
8. Go back to https://twitchtokengenerator.com and select **Custom Scope**.
9. Under the **v5** category, change **chat_login** to **Yes** and everything else to **No**.
10. Click **Generate** at the bottom of the page.
11. When asked to authenticate, make sure you are logged in with **YOUR TWITCH BOT ACCOUNT** and click **Allow**.
12. Copy the **Access Token** it provides and head back to this widget in your StreamElements overlay.
13. Click the widget and select **Settings** in the left-hand menu.
14. Under the **Chat** drop-down that appears, paste your access token into the **OAuth Token** field.
15. In the **Chat Bot Username** field, type your chatbot's Twitch username.

## LINKING YOUR CHANNEL POINT REWARDS
Click on the widget in your StreamElements overlay and click the **Channel Points** option in the left-hand menu. This will display a list of settings below to help customise which redemptions to listen out for and what they will do.

### Chat
**Response** - The text response to be posted to chat when the reward has been redeemed. Use *{user}* and *{item}* in your message to insert the username of the redeemer and the selected item.

### Items

**Items** - A comma-separated list of the items to include. For example: One,Two,Three,Four,Five,Six

### Channel Points

**Redemption Name** - The *exact* name of the channel point reward to trigger the shuffler.
