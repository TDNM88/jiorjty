const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for the main app (index.html)
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes redirect to splash.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'splash.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Splash page: http://localhost:${port}`);
    console.log(`Main app: http://localhost:${port}/app`);
});
