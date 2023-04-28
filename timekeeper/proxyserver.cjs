const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

app.use(cors()); // Add this line to include the cors middleware
const yelpApiKey = 'SmnwB0JMGLWfiMP7jcpFY4NNRtxVztjNKMb2AjR9sZB2LnaPtr8-GQd6enDpL-Z2s4h0ml_GSQ0uACBH_L6Ii9rvNVfSkaKO5c2L9EKG6FzFGl7t20xG3Khl6ClJZHYx';




const yelpProxyOptions = {
    target: 'https://api.yelp.com',
    changeOrigin: true,
    pathRewrite: {
        '^/yelp': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', `Bearer ${yelpApiKey}`);
    },
};
app.get('/', (req, res) => {
    res.send('This works!');
});
app.use('/yelp', createProxyMiddleware(yelpProxyOptions));

const PORT = process.env.PORT || 3000;

// Read the private key and certificate
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate,'asdasdasdasd'};

// Create an HTTPS server with the credentials
const httpsServer = https.createServer(credentials, app);

// Start the HTTPS server
httpsServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});