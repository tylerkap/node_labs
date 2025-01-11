const readline = require('readline');

const rl = readline.createInterface(
        process.stdin, process.stdout);

rl.question(`What is your age? `);
rl.on('line', (age) => {
    console.log(`Age received by the user: ${age}`);
    rl.close();
});
