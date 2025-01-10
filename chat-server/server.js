const net = require('net');

let sockets = [];

const server = net.createServer(socket => {
    
    sockets.push(socket);
    console.log('client connected');
    
    socket.on('data', (data) => {
        broadcast(data, socket);
    });

    socket.on('error', (err) => {
        console.log('A clilent has disconnected.')
    });

    socket.on('close', () => {
        console.log('A client has left the chat.');
    });

}).listen(5000);

function broadcast(message, socketSent) {

    if(message.toString() === 'quit') {
        const index = sockets.indexOf(socketSent);
        sockets.splice(index, 1);
    }
    else {
        sockets.forEach((socket) => {
            
            if(socket != socketSent) {
                socket.write(message);
            }
        });
    }
}






// process.stdin.on('readable', () => { 
//     let chunk; 
//     // Use a loop to make sure we read all available data. 
//     while ((chunk = process.stdin.read()) !== null) { 
//      process.stdout.write(`data: ${chunk}`);

//     }
// });