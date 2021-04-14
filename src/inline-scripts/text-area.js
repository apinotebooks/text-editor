/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

(function (app) {
  const textArea = document.getElementById('textEditor');

  /*
    // Setup the main textarea 
    textArea.addEventListener('input', () => {
      app.setModified(true);
    });
  
    // Hide menus any time we start typing 
    textArea.addEventListener('focusin', () => {
      myMenus.hideAll();
    });
  
    // Listen for tab key 
    textArea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && app.options.captureTabs) {
        e.preventDefault();
        app.insertIntoDoc('\t');
      }
    });
  
    // Initialize the textarea, set focus & font size 
    window.addEventListener('DOMContentLoaded', () => {
      textArea.style.fontSize = `${app.options.fontSize}px`;
      app.setFocus();
    });
  */

  /**
   * Sets the text of the editor to the specified value
   *
   * @param {string} val
   */
  app.setText = (val) => {
    val = val || '';
    app.notebookContent = val;
    var variables = {};
    const mount = document.querySelector("#notebookEditor");
    const loginBox = document.getElementById("loginBox");
    const loginMsg = document.getElementById("loginMsg");

    var sb = document.getElementById("notebookSandbox");
    if (sb) sb.classList.toggle("hidden", true);

    var nbRequiresLogin = app.notebookRequiresLogin(val);
    if (nbRequiresLogin) {
      var token = authClient.getToken();

      if (token) {
        variables._token = token.access_token;
      } else {

        // setup auth event listener
        if (!app._authSetup) {

          // start oauth2 flow
          loginBox.addEventListener("click", (event) => {
            authClient.authorize();
          });

          // oauth token received
          window.addEventListener("message", (event) => {
            
            if (event.data.status == "oauth_callback_ok") {             
              authClient.callback(event.data.href).then((token) => {
               app.setText(app.notebookContent);
              });              
            } 
          });

          app._authSetup = true;
        }

        loginMsg.innerText = "This notebook is connected with " + authClient.getconnector_name();
        loginBox.classList.toggle("hidden", false);
        loginBox.toggleAttribute("open", true);

        return;
      }
    }

    loginBox.toggleAttribute("open", false);

    if (!sb) {
      // create new instance
      const el = new StarboardNotebookIFrame({
        notebookContent: val,
        notebookVariables: variables,
        debug: false,
        src: "https://apinotebooks-sandbox.netlify.app"
      });

      el.style.width = "100%";
      el.id = "notebookSandbox";
      mount.appendChild(el);
    } else {
      // reload instance with new content      
      sb.notebookContent = val;
      sb.notebookVariables = variables;
      sb.sendMessage({
        type: "NOTEBOOK_RELOAD_PAGE"
      });
      sb.classList.toggle("hidden", false);
    }
    // textArea.value = val;
  };

  app.notebookRequiresLogin = (val) => {

    if (!val.startsWith("---\n")) return false;
    val = val.substring(4); // remove leading ---
    const end = val.indexOf("---\n");
    if (end < 1) return false; // no trailing ---

    val = val.substring(0, end);
    var frontmatter = jsyaml.load(val);

    // check required fields for OAuth2 PKCE
    if ((!!frontmatter.ConnectorName &&
      !!frontmatter._ClientId &&
      !!frontmatter._AccessCodeServiceEndpoint &&
      !!frontmatter._AccessTokenServiceEndpoint &&
      !!frontmatter._Scopes) == false) return;

    // replace , and double spaces with single space
    var scopes = frontmatter._Scopes.split(",").join(" ").split("  ").join(" ").split(" ");

    // setup authClient
    window.authClient = new jso.JSO({
      connector_name: frontmatter.ConnectorName,
      client_id: frontmatter._ClientId,
      redirect_uri: window.location.origin + "/popupCallback.html",
      authorization: frontmatter._AccessCodeServiceEndpoint,
      token: frontmatter._AccessTokenServiceEndpoint,

      response_type: "code",
      scopes: scopes,

      debug: true
    });

    return true;
  };

  /**
   * Gets the text from the editor
   *
   * @return {string}
   */
  app.getText = () => {
    var sb = document.getElementById("notebookSandbox");
    var content = sb?.notebookContent || "";
    return content;
  };

  /**
   * Inserts a string into the editor.
   *
   * @param {string} contents Contents to insert into the document.
   */
  app.insertIntoDoc = (contents) => {
    debugger;
    // Find the current cursor position
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    // Get the current contents of the editor
    const before = textArea.value;
    // Get everything to the left of the start of the selection
    const left = before.substring(0, startPos);
    // Get everything to the right of the start of the selection
    const right = before.substring(endPos);
    // Concatenate the new contents.
    textArea.value = left + contents + right;
    // Move the cursor to the end of the inserted content.
    const newPos = startPos + contents.length;
    textArea.selectionStart = newPos;
    textArea.selectionEnd = newPos;
    app.setModified(true);
  };


  /**
   * Adjust the font size of the textarea up or down by the specified amount.
   *
   * @param {Number} val Number of pixels to adjust font size by (eg: +2, -2).
   */
  app.adjustFontSize = (val) => {
    const newFontSize = app.options.fontSize + val;
    if (newFontSize >= 2) {
      textArea.style.fontSize = `${newFontSize}px`;
      app.options.fontSize = newFontSize;
    }
    gaEvent('Options', 'Font Size', null, newFontSize);
  };

  /**
   * Moves focus to the text area, and potentially cursor to position zero.
   *
   * @param {boolean} startAtTop
   */
  app.setFocus = (startAtTop) => {
    /*
    if (startAtTop) {
      textArea.selectionStart = 0;
      textArea.selectionEnd = 0;
      textArea.scrollTo(0, 0);
    }
    textArea.focus();
    */
  };
})(app);
