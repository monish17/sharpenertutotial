const myform=document.querySelector('#myform');
const nameInput=document.querySelector('#name');
const email=document.querySelector('#email');
const phonenumber=document.querySelector('#phonenumber');
const schedule=document.querySelector('#schedule');
const msg=document.querySelector('.msg')

myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    //console.log(nameInput.value);
    //console.log(schedule.value);
    if (nameInput.value===''||email.value===''||phonenumber.value==='' || schedule.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }
    else{
       console.log('success');
       localStorage.setItem('name',nameInput.value);
       localStorage.setItem('email',email.value);
       localStorage.setItem('phonenumber',phonenumber.value);
       localStorage.setItem('schedule',schedule.value);

    }
}