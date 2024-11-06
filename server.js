const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS package
const app = express();

// Enable CORS for all origins (adjust if needed)
app.use(cors());

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle any requests that don’t match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
