---
ConnectorName: o365
_ClientId: b75fd212-b8ef-44ce-8e3c-585419557ea7
_AccessCodeServiceEndpoint: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
_AccessTokenServiceEndpoint: https://login.microsoftonline.com/common/oauth2/v2.0/token
_Scopes: User.Read
---
```javascript
//console.log(runtime.variables);

var response = await fetch("https://graph.microsoft.com/v1.0/me", { 
  'credentials': 'omit',
  headers: {    
    'Authorization': 'Bearer ' + runtime.variables._token
  }
});

var json = await response.json();

html`<h1>Hello ${json.givenName}</h1>`;
```