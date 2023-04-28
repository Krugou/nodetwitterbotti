const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

const yelpApiKey = 'YOUR_YELP_API_KEY';

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

app.use('/yelp', createProxyMiddleware(yelpProxyOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
