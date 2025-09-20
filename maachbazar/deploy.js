const fs = require('fs');
const path = require('path');
const https = require('https');

const ACCOUNT_ID = '58a56e52326cb5c0cf6c1b40decfb0fa';
const PROJECT_NAME = 'maachbazar';

const filePath = path.join(__dirname, 'index.html');
const fileContent = fs.readFileSync(filePath, 'utf8');

const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer YOUR_API_TOKEN'
    }
};

const boundary = '---------------------------' + Date.now().toString(16);
options.headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary;

const body = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="index.html"; filename="index.html"',
    'Content-Type: text/html',
    '',
    fileContent,
    `--${boundary}--`
].join('\r\n');

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(body);
req.end(); 