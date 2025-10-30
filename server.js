const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define the content using HTML and CSS
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello Render</title>
    <style>
        /* CSS to center the content vertically and horizontally */
        body {
            display: flex;
            justify-content: center; /* Center horizontally */
            align-items: center;    /* Center vertically */
            height: 100vh;          /* Use full viewport height */
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0; 
        }

        /* Styling for the main message */
        h1 {
            font-size: 5em; /* Make the text much bigger */
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Hello, From Zachary Pham!</h1>
</body>
</html>
`;

// Define the route
app.get('/', (req, res) => {
  // Set the Content-Type header to tell the browser it's HTML
  res.setHeader('Content-Type', 'text/html');
  // Send the HTML content
  res.send(htmlContent);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});