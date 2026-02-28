const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Albhery#@#8/1',
    port: 5000,
});

console.log('Attempting to connect to PostgreSQL on localhost:5000...');
client.connect()
    .then(() => {
        console.log('✅ SUCCESS: Connected to PostgreSQL!');
        client.end();
    })
    .catch(err => {
        console.error('❌ FAILURE: Connection error');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        process.exit(1);
    });
