const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

// Define the route
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});