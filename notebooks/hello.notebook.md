```javascript worker {"run_on_load":true}

async function handleRequest(request) {
    var response = { name: "world"};
    return response;
}

```
```json template
{ "hello": "${name}" }
```