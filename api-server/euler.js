// Problem 1: Multiples of 3 or 5


let count = 0;

for(let i = 0; i < 1000; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
        count += i;
    }
}

console.log(count);



// Problem 2: Even Fibonacci Numbers


let fibonacci = [0, 1];
let addNum = 0;
let evenCount = 0;

for (let i = 0; i < 100; i++) {
    
    addNum = fibonacci[i] + fibonacci[i + 1]
    
    if (addNum < 4000000) {
        fibonacci.push(addNum);
    }

    if (addNum % 2 === 0) {
        console.log(addNum);
        evenCount += addNum;
    }
}


console.log(`Problem 2: ${evenCount}`);

console.log(fibonacci);


// Problem 3: Largest Prime Factor

