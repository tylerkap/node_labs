const net = require('net');
const readLine =  require('readline');
const { stdin: input, stdout: output } = require('process');
const { Readline } = require('readline/promises');

const rl = readLine.createInterface({input, output});


const waitForUsername = new Promise(resolve => {
    rl.question('Enter a username to join the chat: ', (username) => {
        resolve(username);
    });
});

waitForUsername.then((username) => {

    const socket = net.connect({port: 3000}, () => {
        console.log(`Welcome ${username} to the chat room.`);
    });

    socket.on('connect', () => {
        socket.write(`${username} has joined the chat.`);
    });

    rl.on('line', (data) => {
        if (data === 'quit') {
            socket.write(`${username} has left the chat.`);
            socket.setTimeout(1000);
        }
        else {
            socket.write(`${username}: ${data}`);
        }
    })

    socket.on('data', (data) => {
        console.log('\x1b[33m%s\x1b[0m', data);
    });

    socket.on('timeout', () => {
        socket.write('quit');
        socket.end();
    });

    socket.on('end', () => {
        process.exit();
    })

    socket.on('error', () => {
        console.log('The server seems to have been shut down...');
    });
});