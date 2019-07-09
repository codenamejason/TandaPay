// TODO: make this html injection safe
module.exports = ({ heading, text }) => `
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
    </style>
  </head>
  <body>
    <h1>TandaPay</h1>
    <div id="container">
      <h2>${heading}</h2>
      <p>${text}</p>
    </div>
  </body>
</html>
`
