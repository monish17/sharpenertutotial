"use strict";
const num1element = document.getElementById('num1');
const num2element = document.getElementById('num2');
const buttonelement = document.querySelector('button');
const numarray = [];
const stringarray = [];
buttonelement === null || buttonelement === void 0 ? void 0 : buttonelement.addEventListener('click', () => {
    const num1 = num1element.value;
    const num2 = num2element.value;
    const result = add(+num1, +num2);
    numarray.push(result);
    const stringresult = add(num1, num2);
    stringarray.push(stringresult);
    printresult({ val: result, timestamp: new Date() });
    console.log(numarray, stringarray);
});
function printresult(objresult) {
    console.log(objresult.val);
}
function add(numb1, numb2) {
    if (typeof numb1 === 'number' && typeof numb2 === 'number') {
        return numb1 + numb2;
    }
    else if (typeof numb1 === 'string' && typeof numb2 === 'string') {
        return numb1 + " " + numb2;
    }
    else {
        return +numb1 + +numb2;
    }
}
const mypromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("it worked");
    }, 1000);
});
mypromise.then((result) => {
    console.log(result.split(' '));
});
