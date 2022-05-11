const express = require("express");

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express server online");
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});