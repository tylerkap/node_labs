const net = require('net');
const fs = require('fs');


let sockets = [];
let users = [];
let _kickPassword = 'password'

fs.writeFile('chat.log', 'This is the Chat Log', (err) => {
    if (err) {
        throw err;
    }
    console.log('Created File');
});


const server = net.createServer(socket => {
    
    sockets.push(socket);

    
    console.log('client connected');
    //console.log(socket);

    // socket.on('setUsername', (username) => {
    //     console.log(username);
    // });

    // socket.emit('setUsername');


    socket.on('data', (data) => {
        processData(data, socket);
    });
    
    socket.on('error', (err) => {
        console.log('A client has disconnected.')
    });

    socket.on('close', () => {
        console.log(`A client has left the chat.`);
    });

});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});

function broadcast(message, ignoreSocket) {
    sockets.forEach(socket => {
        
        if (ignoreSocket === null) {
            socket.write(message);
        }
        else if (socket != ignoreSocket) {
            socket.write(message);
        }
    });
}

function sendMessage(username, message, fromUserSocket) {

    let fromUser = '';
    
    const userIndex = users.findIndex((user) => user.username === username);
    const userFromIndex = users.findIndex((user) => user.socket === fromUserSocket);

    if (userFromIndex > -1) {
        fromUser = `${users[userFromIndex].username} (private message): `;
    }

    if (userIndex > -1 ) {
        users[userIndex].socket.write(fromUser + message);
    }

}




function processData(message, socketSent) {

    let messageStr = message.toString();

    console.log(messageStr);
    
    if (messageStr.startsWith('/')) {
        if(messageStr.startsWith('/clientlist')) {
            console.log(messageStr);

            let chatClientStr = "";

            users.forEach((user) => {
                chatClientStr += user.username + '\n';
            })

            socketSent.write(chatClientStr);

        }
        else if (messageStr.startsWith('/w ')) {
            let tempMessage = messageStr.substring(3);
            let index = tempMessage.indexOf(' ');
            let username = tempMessage.substring(0, index).trim();
            let privateMessage = tempMessage.substring(index + 1);

            console.log(username);
            console.log(privateMessage);

            sendMessage(username, privateMessage, socketSent);
        }
        else if (messageStr.startsWith('/username ')) {
            let tempArray = messageStr.split(' ');
            let newUsername = tempArray[1];

            let index = users.findIndex((user) => user.socket === socketSent);
            users[index].username = newUsername;
        }
        else if (messageStr.startsWith('/kick')) {
            let tempArray = messageStr.split(' ');
            let kickedUser = tempArray[1];
            let kickPassword = tempArray[2];

            if (kickPassword === _kickPassword) {
                
                let index = users.findIndex((user) => user.username === kickedUser);
    
                if (index > -1) {
                   users[index].socket.write('You have been kicked by an admin');
                   users[index].socket.end();
                   users.splice(index, 1); 
                   let kickedMessage = `${kickedUser} has been kicked by an admin`;
                   broadcast(kickedMessage, socketSent);
                }
            }
        }
    }
    else {

        
        if (messageStr.includes(':')) {
            
            let index = messageStr.indexOf(':');
            let username = messageStr.substring(0, index).trim();
            let userMessage = messageStr.substring(index + 1).trim();

            console.log(username);
            console.log(userMessage);

            if (userMessage === 'quit') {

                console.log('IS this working???');
                //const userIndex = users.findIndex((user) => user.username === username);
                const userIndex = users.findIndex((user) => user.socket === socketSent);
                console.log(`This is the userIndex: ${userIndex}`);

                if (userIndex > -1 ) {
                    console.log(`User Quit: ${users[userIndex].username}`);
                    let userQuit = `${users[userIndex].username} has left the chat.`;
                    broadcast(userQuit, socketSent);
                    users.splice(userIndex, 1);
                }

                const index = sockets.indexOf(socketSent);
                sockets.splice(index, 1);

            }
            else {

                console.log(`Got Username: ${username}`);
                let userSocket = users.find(user => user.username === username);
                
                // By using the username we can find the object in the users array
                
                broadcast(messageStr, socketSent);
        
                fs.appendFile('chat.log', `\r\n${message}`, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log('Wrote to chat log file');
                });
            }
        }
        else {
            console.log(messageStr);
            let userSocket = {
                "username": messageStr,
                "socket": socketSent
            }
            
            users.push(userSocket);

            let newUser = `${messageStr} has joined the chat.`;

            broadcast(newUser, socketSent);
        }
    }
}