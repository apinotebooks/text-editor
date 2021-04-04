```html
<!-- Latest CDN production JavaScript and CSS -->
<script src="https://global.oktacdn.com/okta-signin-widget/5.5.0/js/okta-sign-in.min.js" type="text/javascript"></script>
<link href="https://global.oktacdn.com/okta-signin-widget/5.5.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet"/>

```
```html
<div id="widget-container"></div>

<script>
  const signIn = new OktaSignIn({baseUrl: 'https://${yourOktaDomain}'});
  signIn.renderEl({
    el: '#widget-container'
  }, function success(res) {
    if (res.status === 'SUCCESS') {
      console.log('Do something with this sessionToken', res.session.token);
    } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  });
</script>

```