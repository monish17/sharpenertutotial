const array = ['apple', 'oranges' , ' ', 'mango', ' ' , 'lemon'];
console.log(array.map(value =>{
    if(value===' '){
        return 'Empty String';
    }else{
        return value
    }
}))