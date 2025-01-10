const net = require('net');

let client = net.createConnection({port: 5000}, () => {
    console.log("Connected");
    client.write('world!\r\n');
});

client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});