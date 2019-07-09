// TODO: make this html injection safe
module.exports = ({ secretary, group, url, code }) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        color: #333;
        font-family: Sans-Serif;
        margin: 50px;
      }
      a {
        color: #303090;
      }
      #container {
        padding: 25px;
        border: 1px solid #ddd;
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
    <h1>TandaPay</h1>
    <div id="container">
      <h2>You've been invited to a group on TandaPay!</h2>
      <p>${secretary} has invited you to the group <a href="#">${group}</a>.
         You can accept this invitation by clicking the link below.
         Your access code is <span id="code">${code}</span>.
      </p>
      <p class="center"><a id="cta" style="text-decoration: none" href="${url}">Accept Invitation</a></p>
    </div>
  </body>
</html>
`
