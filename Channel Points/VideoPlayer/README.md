# Video Player
A widget that will play a video when a user redeems a Channel Point reward.

Full instructions to add the widget to your overlay, connect it to Twitch and set up the redemptions are below.

## HOW TO: ADD THE WIDGET TO YOUR OVERLAY
To add this widget to your overlay, follow these steps:

1. Go to StreamElements, sign in and go to *My Overlays* in the left-hand menu.
2. Click *Edit* on an existing overlay you would like to add this widget to **or** select *Create Blank Overlay* in the top-right.
3. Click the circular *+* button at the bottom of the screen and select *Static / Custom* -> *Custom Widget*
4. Click the new widget that has appeared in your overlay and click *Settings* in the left-hand menu.
5. Click *Open Editor*
6. Replace *all* of the code in the **HTML** tab with the code inside the *videoPlayer.html* file in this repository.
7. Replace *all* of the code in the **CSS** tab with the code inside the *videoPlayer.css* file in this repository.
8. Replace *all* of the code in the **JS** tab with the code inside the *videoPlayer.js* file in this repository.
9. Replace *all* of the code in the **Fields** tab with the code inside the *videoPlayer.json* file in this repository.
10. Delete *all* of the code inside the **Data** tab.
11. Click *Done* in the bottom-right.

## HOW TO: CONNECT THE WIDGET TO TWITCH
This widget will need to be granted access to your channel's Channel Point Redemptions. To do this, follow the steps below:

1. Go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the **Helix** category, change **channel:read:redemptions** to **Yes** and everything else to **No**.
3. Click **Generate** at the bottom of the page.
4. When asked to authenticate, make sure you are logged in with **YOUR TWITCH STREAMING ACCOUNT** and click **Allow**.
5. Copy the **Access Token** it provides you and head back to this widget in your StreamElements overlay.
6. Click the widget and select **Settings** in the left-hand menu.
7. Under the **API** drop-down that appears, paste your access token into the **OAuth** field.

## HOW TO: LINK YOUR CHANNEL POINT REWARDS
Click on the widget in your StreamElements overlay and click the **Settings** option in the left-hand menu. This will display a list of settings below to help customise which redemptions to listen out for and what sound they will play.

### Redemptions
By default, you can set up to *ten* different sound-effect channel point rewards. If you need more, please see the **ADD MORE REDEMPTIONS** section below.

**Redemption Name** - The *exact* name of the channel point reward to trigger a sound. *NOTE: Can be left blank if not required*.

**Redemption Video** - The audio file to play.

## HOW TO: ADD MORE REDEMPTIONS
By default I've allowed for up to 10 redemptions. If you need more, follow these instructions:

1. Copy the contents of the *add_redemption.json* file in this repository.
2. In your StreamElements overlay, click on this widget and click **Settings** in the left-hand menu.
3. Click on **Open Editor** and navigate to the **Fields** tab.
4. Scroll down to the very last node that contains **redemption_audio_** and paste the code directly after it. *(See below)*

```json
"redemption_name_10": {
    "type": "text",
    "label": "Redemption Name",
    "value": "",
    "group": "Redemptions"
  },
  "redemption_video_10": {
    "type": "video-input",
    "label": "Redemption Video",
    "value": "",
    "group": "Redemptions"
  },
  /* ***** PASTE CODE HERE ***** */
  "redemption_name_X": {
    "type": "text",
    "label": "Redemption Name",
    "value": "",
    "group": "Redemptions"
  },
  "redemption_video_X": {
    "type": "video-input",
    "label": "Redemption Video",
    "value": "",
    "group": "Redemptions"
  },
  /* ***** END OF PASTED CODE ***** */
  "queue_refresh": {
    "type": "number",
    "label": "Refresh Rate (Seconds)",
    "value": 1,
    "group": "Queue"
  },
```

5. Replace the *'X'* in **both** new node names with the next number in the sequence. *E.g. The last number in the code sample above is '10' so we will change the names to **redemption_name_11** and **redemption_video_11**.*
6. Click **Done** and you should see another slot become available in the **Settings** -> **Redemptions** drop-down in the left-hand menu.
7. You can do this for as many times as you need to add additional sounds!

