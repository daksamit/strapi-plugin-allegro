"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Authorize page
   */

  authorize: async (ctx) => {
    const verifyEndpoint = "/allegro/auth/verify";
    const accounts = [...strapi.config.hook.settings.allegro.accounts];

    const client = strapi.hook.allegro.clients.get(accounts[0]);
    const bind = await client.bindApp();
    const { verification_uri_complete, device_code } = bind;

    ctx.send(`
      <div style="display: flex; flex-direction: column;">
        <h1>Autoryzuj konto allegro</h1>
          <a href="${verification_uri_complete}" target="_blank">Powiąż aplikację</a>
        <h2>Weryfikuj dla wybranego konta:</h2>
        <ul style=" width: 160px; height: 420px; list-style: none; padding-left: 0">
          ${accounts
            .map(
              (v) =>
                `<li><button onclick="postRequest('${v}')">${v}</button></li>`
            )
            .join("")}
        <ul>
      </div>
      <script>
        async function postRequest(account) {
          var code = '${device_code}'
          console.log(code)
          var result = await fetch('${verifyEndpoint}', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              account,
              code
            })
          })
          result = await result.json()
          console.log({
            account,
            code,
            result
          })
          if (result && result.access_token) {
            alert('autoryzowano pomyślnie')
          }
          else {
            alert('błąd autoryzacji!')
          }
        }
      </script>
    `);
  },

  /**
   * Verify allegro account credentials.
   *
   * @return {Object}
   */

  verify: async (ctx) => {
    const { account, code } = ctx.request.body;
    const client = strapi.hook.allegro.clients.get(account);
    return client.authorize(code);
  },
};
