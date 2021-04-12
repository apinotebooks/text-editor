```json adaptive-form {"run_on_load":true}

{
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
        {
            "type": "Input.Text",
            "placeholder": "Placeholder text",
            "id": "name",
            "value": "world"
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
```javascript worker

async function handleRequest(request) {
    var response = { hello: request.name };
    return response;
}

```