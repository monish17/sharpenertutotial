//javascript code for creating an expense tracker
const myform=document.querySelector('#form');
const expenseAmount=document.querySelector('#expense-amount');
const description=document.querySelector('#description');
const category=document.querySelector('#category');
const ul=document.querySelector('#ul');
myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    const msg = document.createElement('div');
    myform.appendChild(msg);
    //console.log('button pressed');
    if (expenseAmount.value===''||description.value===''||category.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }else{
        const li=document.createElement('li');
        li.appendChild(document.createTextNode(`${expenseAmount.value} : ${description.value}:${category.value}`));
        ul.appendChild(li);
        const separator=document.createTextNode(' ');
        li.appendChild(separator);
        const edit=document.createElement('input');
        edit.type='button';
        edit.value='Edit';
        li.appendChild(edit);
        li.appendChild(separator);
        const del=document.createElement('input');
        del.type='button';
        del.value='Delete';
        li.appendChild(del);
        del.addEventListener('click',deleteclick);
        edit.addEventListener('click',edititem);
        const myobj={
            Expense_Amount:expenseAmount.value,
            description:description.value,
            category:category.value,
        }
        localStorage.setItem(expenseAmount.value,JSON.stringify(myobj));
        function deleteclick(e){
            const li = e.target.closest('li');
            if (li) {
                li.remove();
                const liText=li.textContent;
                const parts = liText.split(':');
                const expense_Amount = parseFloat(parts[0].trim());
                //console.log(emailValue);
                localStorage.removeItem(expense_Amount);
            }
        }
        function edititem(e){
            console.log(li);
            console.log(li.textContent);
            const datastring=li.textContent;
            const datacomponents=datastring.split(':');
            expenseAmount.value=parseFloat(datacomponents[0]);
            description.value=datacomponents[1];
            category.value=datacomponents[2];
            li.remove();
            localStorage.removeItem(expenseAmount.value);
        }
        expenseAmount.value='';
        description.value='';
        category.value='';
    }
}
