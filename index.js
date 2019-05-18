const express = require("express");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("In progress");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
