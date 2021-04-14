---
ConnectorName: o365
_ClientId: b75fd212-b8ef-44ce-8e3c-585419557ea7
_AccessCodeServiceEndpoint: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
_AccessTokenServiceEndpoint: https://login.microsoftonline.com/common/oauth2/v2.0/token
_Scopes: User.Read Mail.Read 
---
```json adaptive-form {"run_on_load":true}
{
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
        {
            "type": "Input.Text",
            "label": "Number of items to skip / nextPageToken",
            "value": "0",
            "id": "$nextPageToken"
        }
    ],
    "actions": [
        {
            "type": "Action.Submit",
            "title": "Submit",
            "associatedInputs": "auto"
        }
    ]
}
```
```javascript connector

async function handleRequest(request) {

  // use luxon (as the successor of momentjs) to format dates
  let {DateTime} = await import('https://esm.run/luxon');

  var response = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$filter=isRead ne true&$skip=${request['$nextPageToken']}`, { 
    'credentials': 'omit',
    headers: {    
      'Authorization': 'Bearer ' + request._token
    }
  });

  var json = await response.json();

  if(json.error?.message) {
    model = {
      errorMessage: json.error.message,
      errorCode: json.error.code=="InvalidAuthenticationToken" ? 461 : 500
    };

    return model;
  } 

  var items = [];

  for(var i=0; i<json.value.length; i++) {
    var raw = json.value[i];
    items.push({
      id: raw.id,
      title: raw.subject,
      description: raw.sender.emailAddress.name,
      link: raw.webLink,
      date: raw.sentDateTime,
      ago: DateTime.fromISO(raw.sentDateTime).toRelative()
    })
  }
    var model = {
        actionable: false,
        _card: {
            type: 'status-list'
        },
        title: 'My unread emails',
        link: 'https://...',
        linkLabel: 'Go to ...',
        thumbnail: 'https://www.adenin.com/assets/images/identity/logo_adenin.svg',
        items: items
    }

    return model;
}

```

# Unread Mail

Get a simple list of your unread mail from your Outlook inbox

## Benefits

See all items from the selected mailbox that are unread. Ideal for monitoring shared inboxes for Sales, Support, etc.

## Utterances

1. Show me (my) unread Outlook (mail|email|messages)
2. Do I have any unread (mail|mails|emails|items) in Outlook?

## Audience

All

## Features

Notifications

## Screenshots

1. ![List of unread emails from your Outlook inbox in a Card](https://www.adenin.com/assets/images/wp-images/2020/06/2020-06-26_20-15-54.png)
