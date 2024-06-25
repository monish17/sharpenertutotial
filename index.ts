const num1element=document.getElementById('num1') as HTMLInputElement;
const num2element=document.getElementById('num2') as HTMLInputElement;
const buttonelement=document.querySelector('button')!;

const numarray:number[]=[];
const stringarray:string[]=[];
type numOrString= number | string ;
buttonelement?.addEventListener('click',()=>{
    const num1=num1element.value;
    const num2=num2element.value;
    const result=add(+num1,+num2)
    numarray.push(result as number);
    const stringresult = add(num1,num2);
    stringarray.push(stringresult as string);
    printresult({val:result as number,timestamp:new Date()});
    console.log(numarray,stringarray);
})

function printresult(objresult:{ val:number , timestamp:Date}){
    console.log(objresult.val);
}

function add(numb1:numOrString,numb2:numOrString){
    if(typeof numb1 === 'number' && typeof numb2 === 'number'){
        return numb1+numb2;
    }else if(typeof numb1 === 'string' && typeof numb2 === 'string'){
        return numb1+ " " +numb2;
    }
    else{
        return +numb1 + +numb2
    }
    
}

const mypromise = new Promise<string>((resolve,reject)=>{
    setTimeout(()=>{
        resolve("it worked");
    },1000)
});

mypromise.then((result)=>{
    console.log(result.split(' '));
});