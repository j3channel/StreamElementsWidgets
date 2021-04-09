# Greeter
This widget will show an on-screen welcome message to users that type in chat for the first time!

## HOW TO: ADD TO YOUR OVERLAY
To add this widget to your overlay, follow these steps:

1. Go to StreamElements, sign in and go to *My Overlays* in the left-hand menu.
2. Click *Edit* on an existing overlay you would like to add this widget to **or** select *Create Blank Overlay* in the top-right.
3. Click the circular *+* button at the bottom of the screen and select *Static / Custom* -> *Custom Widget*
4. Click the new widget that has appeared in your overlay and click *Settings* in the left-hand menu.
5. Click *Open Editor*
6. Replace *all* of the code in the **HTML** tab with the code inside the *greeter.html* file in this repository.
7. Replace *all* of the code in the **CSS** tab with the code inside the *greeter.css* file in this repository.
8. Replace *all* of the code in the **JS** Tab with the code inside the *greeter.js* file in this repository.
9. Replace *all* of the code in the **Fields** tab with the code inside the *greeter.json* file in this repository.
10. Delete *all* of the code inside the **Data** tab.
11. Click *Done* in the bottom-right.

## HOW TO: CUSTOMISE
This widget can be customised to suit your stream. To do this, click on this widget in your StreamElements Overlay, click **Settings** in the left-hand menu and browse the drop-down menus. In case you are unsure what any of the settings do, here is a glossary:

### Branding
**Background Colour** - Background colour of the message.

**Text Colour** - Main colour of the message text.

**Accent Colour** - Alternate colour to use when displaying the username.

**Font Name** - The text font of the message.

**Font Size** - Size of the message font.

### Display
**Corner Radius** - The roundness (in pixels) of the box's edges.

**Padding** - The gap (in pixels) to be left between the text and the edges of the box.

### Message
**Ignore** - A space-separated list of usernames to ignore and **not** display messages for. (Typically bots such as StreamElements, NightBot and StreamLabs).

**Welcome Message 1-5** - Messages that will be randomly selected to greet the chatter. If you require less than five, just leave the others blank.

## SIZING
The widget will adjust its width and height to match the size of its bounds in your StreamElements overlay.
To adjust the **Width** and **Height**, click the widget and click **Position, size and style** in the left-hand menu. 
To prevent text wrapping or cutting, I would recommend setting the width to the same width as the overlay itself.
