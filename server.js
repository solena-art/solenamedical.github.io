const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3002;

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from current directory and subdirectories
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Handle language-specific routes
app.get('/:lang/*', (req, res, next) => {
    const lang = req.params.lang;
    const filePath = req.path.substring(lang.length + 1);
    const fullPath = path.join(__dirname, lang, filePath);
    
    console.log(`Checking path: ${fullPath}`);
    
    if (fs.existsSync(fullPath)) {
        console.log(`Serving file: ${fullPath}`);
        res.sendFile(fullPath);
    } else {
        const indexPath = path.join(__dirname, lang, 'index.html');
        console.log(`Checking index path: ${indexPath}`);
        if (fs.existsSync(indexPath)) {
            console.log(`Serving index: ${indexPath}`);
            res.sendFile(indexPath);
        } else {
            console.log(`File not found: ${fullPath}`);
            next();
        }
    }
});

// Handle root route for language directories
app.get('/:lang', (req, res) => {
    const lang = req.params.lang;
    const indexPath = path.join(__dirname, lang, 'index.html');
    console.log(`Checking language index: ${indexPath}`);
    
    if (fs.existsSync(indexPath)) {
        console.log(`Serving language index: ${indexPath}`);
        res.sendFile(indexPath);
    } else {
        console.log(`Language index not found, serving default index`);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Handle HTML routes
app.get('*.html', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`Serving HTML: ${filePath}`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Handle root route
app.get('/', (req, res) => {
    console.log('Serving root index');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes
app.get('*', (req, res) => {
    console.log('Serving default index for unknown route');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start server with error handling
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('- / (English)');
    console.log('- /ko (Korean)');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
}); 