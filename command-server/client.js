const net = require('net');
const readLine =  require('readline');
const { stdin: input, stdout: output } = require('process');
const { Readline } = require('readline/promises');

const rl = readLine.createInterface({input, output});

let _username = "";


const waitForUsername = new Promise(resolve => {
    rl.question('Enter a username to join the chat: ', (username) => {
        resolve(username);
    });
});

waitForUsername.then((username) => {

    const socket = net.createConnection({port: 3000}, () => {

        _username = username;

        console.log(`\nWelcome ${username} to the chat room.\n
            Here are list of commands:\n
            \t- /w *user* *message* sends a private message to specified user
            \t- /username *edited username* will update your username
            \t- /kick *user* *password* will kick a user from the chat room if you have the correct admin password
            \t- /clientlist sends a list of all connected client names
            \t- /help will show the command help file\n
            Begin chatting by typing your message in the line below:
        `);
        
        
    });
    

    socket.write(username);

    socket.on('connect', () => {
        // socket.write(`${username} has joined the chat.`);
    });

    

    rl.on('line', (data) => {
        if (data === 'quit') {
            // socket.write(`${username} has left the chat.`);
            socket.setTimeout(1000);
        }
        else if (data.startsWith('/username')) {
            let tempArray = data.split(' ');
            _username = tempArray[1];
            socket.write(data);
        }
        else if (data.startsWith('/help')) {
            console.log(`
                Here are list of commands:\n
                \t- /w *user* *message* sends a private message to specified user
                \t- /username *edited username* will update your username
                \t- /kick *user* *password* will kick a user from the chat room if you have the correct admin password
                \t- /clientlist sends a list of all connected client names
                \t- /help will show the command help file\n
                Begin chatting by typing your message in the line below:
            `);
        }
        else if (data.startsWith('/')) {
            socket.write(data);
        }
        else {
            socket.write(`${_username}: ${data}`);
        }
    })

    socket.on('data', (data) => {
        console.log('\x1b[33m%s\x1b[0m', data);
    });

    socket.on('timeout', () => {
        socket.write(`${username}: quit`);
        socket.end();
    });

    socket.on('end', () => {
        process.exit();
    })

    socket.on('error', () => {
        console.log('The server seems to have been shut down...');
    });
});