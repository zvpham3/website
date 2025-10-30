const express = require('express');
const app = express();
// Use the port Render assigns, or 3000 for local testing
const port = process.env.PORT || 3000; 

// Define a route for the root URL ('/')
app.get('/', (req, res) => {
  // Use res.send() to send the text response back to the browser
  res.send('Hello, I am text displayed on Render!'); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});