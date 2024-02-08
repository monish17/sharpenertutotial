//javascript code for creating an expense tracker
const myform=document.querySelector('#form');
const expenseAmount=document.querySelector('#expenseAmount');
const description=document.querySelector('#description');
const category=document.querySelector('#category');
const ul=document.querySelector('#ul');
myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    const msg = document.createElement('div');
    myform.appendChild(msg);
    if (expenseAmount.value===''||description.value===''||category.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }else{
        const myobj={
            Expense_Amount:expenseAmount.value,
            description:description.value,
            category:category.value,
        }
        axios.post("http://localhost:1000/post-data",myobj)
            .then((Response)=>{
                console.log('uploaded and arrived here');
                console.log(Response.data);
                const li=document.createElement('li');
                const hiddenId= document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.value=Response.data.expense.id;
                console.log(hiddenId);
                li.appendChild(hiddenId);
                li.appendChild(document.createTextNode(`${Response.data.expense.Expense_Amount} : ${Response.data.expense.description}:${Response.data.expense.category}`));
                const separator=document.createTextNode(' ');
                li.appendChild(separator);
                const del=document.createElement('input');
                del.type='button';
                del.value='Delete';
                li.appendChild(del);
                ul.appendChild(li);
                del.addEventListener('click',deleteclick);
            })
            .catch((err)=>{
                console.log(err);
            })
        expenseAmount.value='';
        description.value='';
        category.value='';
    } 
}
window.addEventListener("DOMContentLoaded",()=>{
    axios.get("http://localhost:1000/retrieveData")
        .then((response)=>{
            console.log(response.data);
            for(var i=0;i<response.data.length;i++){
                showNewUserOnScreen(response.data[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })
})

function deleteclick(e){
    const li = e.target.closest('li');
    if (li) {
        const hiddenId = li.querySelector('input[type="hidden"]');
        const hiddenIdValue = hiddenId.value;
        console.log(hiddenIdValue);
        axios.delete(`http://localhost:1000/deleteData/${hiddenIdValue}`,)
            .then(response =>{
                if(response.data.message === true){
                    li.remove();
                    console.log("data deleted");
                }
                else{
                    console.log('error in removing the li tag');
                }
            })
            .catch(err => console.log("error happened in axios delete"));
    }
}

function showNewUserOnScreen(user) {
    const li=document.createElement('li');
    const hiddenId= document.createElement('input');
    hiddenId.type = 'hidden';
    hiddenId.value=user.id;
    console.log(hiddenId);
    li.appendChild(hiddenId);
    li.appendChild(document.createTextNode(`${user.Expense_Amount} : ${user.category}`));
    const separator=document.createTextNode(' ');
    li.appendChild(separator);
    const del=document.createElement('input');
    del.type='button';
    del.value='Delete';
    li.appendChild(del);
    ul.appendChild(li);
    del.addEventListener('click',deleteclick);
}