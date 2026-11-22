const express = require('express');
const app = express();
const port = 3001;

// Every file is served by express.static, which keeps requests inside docs/.
const serveDocs = express.static('docs');

// Serve static files from docs directory (a blog post is docs/blog/<slug>/index.html)
app.use(serveDocs);

// Pages whose URL is not their file: point the request at the file and let
// express.static serve it.
const filterRoutes = ['agents', 'commands', 'settings', 'hooks', 'mcps', 'templates'];
app.use((req, res, next) => {
    if (req.path === '/' || filterRoutes.some(filter => req.path === `/${filter}`)) {
        // Filter routes and the default route show index.html
        req.url = '/index.html';
    } else if (/^\/component\/[^/]+\/[^/]+\/?$/.test(req.path)) {
        // Component routes
        req.url = '/component.html';
    }
    next();
});
app.use(serveDocs);

// Blog routes that matched no file
app.use('/blog', (req, res) => {
    res.status(404).send('Blog post not found');
});

app.listen(port, () => {
    console.log(`Development server running at http://localhost:${port}`);
    console.log('Testing URLs:');
    console.log(`- http://localhost:${port}/ (agents)`);
    console.log(`- http://localhost:${port}/mcps`);
    console.log(`- http://localhost:${port}/commands`);
    console.log(`- http://localhost:${port}/settings`);
    console.log(`- http://localhost:${port}/hooks`);
    console.log(`- http://localhost:${port}/templates`);
});
