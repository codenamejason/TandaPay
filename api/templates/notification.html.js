// TODO: make this html injection safe
module.exports = ({ heading, text }) => `
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
    </style>
  </head>
  <body>
    <div id="container">
      <h1>TandaPay</h1>
      <div id="box">
        <h2>${heading}</h2>
        <p>${text}</p>
      </div>
    </div>
  </body>
</html>
`
