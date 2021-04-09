# Slash-Bot
A widget that will automatically perform */commands* when Channel Point Rewards are redeemed.

*Adverts* - Run a 30/60/90/120/150/180 second advert on your channel. You can have up to *three* different advert channel point rewards. *E.G One for 30s, one for 60s and one for 90s.*

*Emote-Only Chat* - Will turn on Emote-Only Chat mode for a specified length of time before turning it back off again. If this is redeemed while the timer is already running, extra time will be added to the current emote-only chat mode.

*Timeout Self* - Will time out the user that redeemed the reward for a specified amount of time.

*Timeout Other* - Will time out a user of the redeemer's choice *(excluding the broadcaster)* for a specified amount of time.

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
