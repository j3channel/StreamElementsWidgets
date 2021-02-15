# OAuth Keys
You will need one or two OAuth keys depending on how you would like to set up the widget.

1. For your Redemptions OAuth key, go to https://twitchtokengenerator.com and select **Custom Scope**.
2. Under the 'Helix' category change *channel:read:redemptions* to 'Yes'.
3. Depending on how you would like to set up the widget, follow either the **Using a Chatbot** or **Using the Streaming Account** instructions.

## USING A CHATBOT
If you would like a chatbot account to write in chat when somebody has been timed out.
*NOTE: Redemptions will NOT be able to time out other moderators for your channel.*

4. Ensure you are logged in on the **Twitch Account you are going to be streaming from** and allow access.
5. Copy the **Access Token** into the widget's *Settings -> Redemptions OAuth Key* field.
6. Go back to https://twitchtokengenerator.com and select **Custom Scope**.
7. Under the 'v5' category change *chat_login* to 'Yes'.
8. Under the 'Helix' category change *channel:moderate* to 'Yes'.
9. Ensure you are logged in on the **Bot Twitch Account** and allow access.
10. Copy the **Access Token** into the widget's *Settings -> Chatbot OAuth Key* field.
11. Set the *Settings -> Chatbot Name* to the **same name as your chatbot account**.
11. Ensure your **Chatbot Account** is a moderator for your streaming account.

## USING THE STREAMING ACCOUNT
If you would like your own account to write in chat when somebody has been timed out.
*NOTE: Redemptions WILL be able to time out other moderators for your channel and will remove their moderator privileges.
       You can add these back manually by typing /mod username in chat from your streaming account.*

4. Also under the 'Helix' category change *channel:moderate* to 'Yes'.
5. Under the 'v5' category change *chat_login* to 'Yes'.
6. Scroll down and click **Generate Token**.
7. Ensure you are logged in on the Twitch Account you are going to be streaming from and allow access.
8. Copy the **Access Token** into both the widget's *Settings -> Chatbot OAuth Key* and *Settings -> Redemptions OAuth Key* fields.
9. Set the *Settings -> Chatbot Name* to the **same name as your streaming account**.
