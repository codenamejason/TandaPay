// TODO: make this html injection safe
module.exports = ({ secretary, group, url, code }) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        color: #333;
        font-family: Sans-Serif;
        width: 100%;
      }
      a {
        color: #303090;
      }
      #container {
        max-width: 500px;
        margin: 0 auto;
      }
      #box {
        border: 1px solid #ddd;
        padding: 15px;
      }
      #cta {
        color: #fff;
        background-color: #355D36;
        width: auto;
        padding: 10px;
        text-align: center;
        margin-bottom: 10px;
      }
      #code {
        font-family: monospace;
        border: 1px solid black;
        padding: 2px;
        display: inline;
        font-weight: bold;
      }
      .center {
        text-align: center;
        margin: 0;
        margin-top: 20px;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <h1>TandaPay</h1>
      <div id="box">
        <h2>You've been invited to a group on TandaPay!</h2>
        <p>${secretary} has invited you to the group <a href="#">${group}</a>.
           You can accept this invitation by clicking the link below.
           Your access code is <span id="code">${code}</span>.
        </p>
        <p class="center"><a id="cta" style="text-decoration: none" href="${url}">Accept Invitation</a></p>
      </div>
    </div>
  </body>
</html>
`
