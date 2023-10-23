const myform=document.querySelector('#myform');
const nameInput=document.querySelector('#name');
const email=document.querySelector('#email');
const phonenumber=document.querySelector('#phonenumber');
const schedule=document.querySelector('#schedule');
const msg=document.querySelector('.msg')
const ul=document.querySelector('#ul');

myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    if (nameInput.value===''||email.value===''||phonenumber.value==='' || schedule.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }
    else{
        const li=document.createElement('li');
        li.appendChild(document.createTextNode(`${nameInput.value} : ${email.value}:${phonenumber.value}:${schedule.value}`));
        ul.appendChild(li);
        let submissions=JSON.parse(localStorage.getItem('submissions'))||[];
        const myobj={
            name:nameInput.value,
            email:email.value,
            phonenumber:phonenumber.value,
            schedule:schedule.value
        }
        submissions.push(myobj);
        localStorage.setItem('submissions',JSON.stringify(submissions));
        /*const myobj_serialized=JSON.stringify(myobj);
        localStorage.setItem('myobj',myobj_serialized);
        //console.log(myobj_serialized);
        //taking the string from the and reversing it as object
        const myobj_deserialized=JSON.parse(localStorage.getItem('myobj',myobj_serialized));
        console.log(myobj_deserialized);*/
        let retrive_submission=JSON.parse(localStorage.getItem('submissions'));
        console.log(retrive_submission);
        nameInput.value=''
        email.value=''
        phonenumber.value=''
        schedule.value=''
    }
}