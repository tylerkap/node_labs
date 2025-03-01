const net = require('net');
const fs = require('fs');

let sockets = [];

fs.writeFile('chat.log', 'This is the Chat Log', (err) => {
    if (err) {
        throw err;
    }
    console.log('Created File');
});

const server = net.createServer(socket => {
    
    sockets.push(socket);
    console.log('client connected');
    
    socket.on('data', data => {
        broadcast(data, socket);
    });

    socket.on('error', err => {
        console.log('A client has disconnected.')
    });

    socket.on('close', () => {
        console.log(`A client has left the chat.`);
    });

})

server.listen(3000, () => {
    console.log('Listening on port 3000');
})

function broadcast(message, socketSent) {

    if(message.toString() === 'quit') {
        const index = sockets.indexOf(socketSent);
        sockets.splice(index, 1);
    }
    else {
        sockets.forEach(socket => {
            
            if(socket != socketSent) {
                socket.write(message);
            }
        });

        fs.appendFile('chat.log', `\r\n${message}`, (err) => {
            if (err) {
                throw err;
            }
            console.log('Wrote to chat log file');
        });
    }
}