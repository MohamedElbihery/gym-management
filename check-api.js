const https = require('https');

const urls = [
    'https://gym-management.onrender.com/api/health',
    'https://gym-management-server.onrender.com/api/health',
    'https://gymforge-pro.onrender.com/api/health'
];

async function check(url) {
    return new Promise((resolve) => {
        console.log(`Checking ${url} (waiting up to 60s for cold start)...`);
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (d) => data += d);
            res.on('end', () => resolve({ url, status: res.statusCode, routing: res.headers['x-render-routing'], body: data }));
        });
        req.on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
        req.setTimeout(60000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
    });
}

async function run() {
    for (const url of urls) {
        const result = await check(url);
        console.log(`> ${result.status} | Routing: ${result.routing || 'N/A'}`);
        if (result.status === 200) {
            console.log(`✅ FOUND: ${result.url}`);
            process.exit(0);
        }
    }
}

run();
