# OAUTH KEYS SETUP
You will need one or two OAuth keys depending on how you would like to set up the widget.

1. For your Redemptions OAuth key, go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the 'Helix' category change *channel:read:redemptions* to 'Yes'.
3. Depending on how you would like to set up the widget, follow either the **Using a Chatbot** or **Using the Streaming Account** instructions.

## USING A CHATBOT
If you would like a chatbot account to write in chat when somebody has been timed out.

*NOTE: Redemptions will NOT be able to time out other moderators for your channel.*

4. Ensure you are logged in on the **Twitch Account you are going to be streaming from** and allow access.
5. Copy the **Access Token**.
6. Open the widget's *Settings* section.  
7. Paste the access token into the *Redemptions OAuth Key* field.
8. Go back to https://twitchtokengenerator.com and select **Custom Scope**.
9. Under the 'v5' category change *chat_login* to 'Yes'.
10. Under the 'Helix' category change *channel:moderate* to 'Yes'.
11. Ensure you are logged in on the **Bot Twitch Account** and allow access.
12. Copy the **Access Token**.
13. Paste the access token into the *Chatbot OAuth Token* field.
14. Set the *Chatbot Name* field to the **same name as your chatbot account**.
15. Ensure your **Chatbot Account** is a moderator for your streaming account.
16. Set the *Response* field if you would like a message in chat when the bot connects successfully. *(Can be left blank)*

## USING THE STREAMING ACCOUNT
If you would like your own account to write in chat when somebody has been timed out.

*NOTE: Redemptions WILL be able to time out other moderators for your channel and will remove their moderator privileges - as per Twitch's command functionality.*

4. Also under the 'Helix' category change *channel:moderate* to 'Yes'.
5. Under the 'v5' category change *chat_login* to 'Yes'.
6. Scroll down and click **Generate Token**.
7. Ensure you are logged in on the Twitch Account you are going to be streaming from and allow access.
8. Copy the **Access Token**.
9. Open the widget's *Settings* section.
10. Paste the access token into both the *Chatbot OAuth Token* and *Redemptions OAuth Token* fields
11. Set the widget's *Chatbot Name* field to the **same name as your streaming account**.
12. Set the *Response* field if you would like a message in chat when the bot connects successfully. *(Can be left blank)*

# SELECTING CHANNEL POINT REDEMPTIONS
You will need to tell the widget which redemption(s) will time users out.

**Timeout Self** - Will time out the user that redeemed the channel point reward.
**Timeout Other** - Will time out another user specified in the channel point's text field by the redeemer. *NOTE: The reward will need to have **Require Viewer to Enter Text** enabled through the custom rewards editor on your Twitch Dashboard for this to work.*

1. Set *Name* field to the name of the redemption you want to hook it to. Ensure the name **exactly matches**.
2. Set *Response* field to the message you would like to be written in chat when the user is timed out. *(Can be left blank if unwanted.)*
3. Set *Duration* field to the duration of the timeout (in seconds).
4. Set *Sound* field to the audio file you want to be played when timed out. *(Can be left blank if unwanted.)*
5. Click *Save* in the top-right.
