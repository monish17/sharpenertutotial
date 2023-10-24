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
        const del=document.createElement('input');
        del.type='button';
        del.value='Delete';
        del.addEventListener('click',deleteclick);
        const edit=document.createElement('input');
        edit.type='button';
        edit.value='Edit';
        edit.addEventListener('click',edititem);
        function deleteclick(e){
            const li = e.target.closest('li');
            if (li) {
                li.remove();
                const liText=li.textContent;
                const parts = liText.split(':');
                const emailValue = parts[1].trim();
                //console.log(emailValue);
                localStorage.removeItem(emailValue);
            }
        }
        function edititem(e){
            console.log(li);
            console.log(li.textContent);
            const datastring=li.textContent;
            const datacomponents=datastring.split(':');
            nameInput.value=datacomponents[0];
            email.value=datacomponents[1];
            phonenumber.value=datacomponents[2];
            //schedule.value=datacomponents[3];
            li.remove();
            localStorage.removeItem(email.value);
        }
        li.appendChild(document.createTextNode(`${nameInput.value} : ${email.value}:${phonenumber.value}:${schedule.value}`));
        const separator=document.createTextNode(' ');
        li.append(separator);
        li.appendChild(del);
        li.append(separator);
        li.appendChild(edit);
        ul.appendChild(li);
        const myobj={
            name:nameInput.value,
            email:email.value,
            phonenumber:phonenumber.value,
            schedule:schedule.value
        }
        localStorage.setItem(email.value,JSON.stringify(myobj));
        /*const myobj_serialized=JSON.stringify(myobj);
        localStorage.setItem('myobj',myobj_serialized);
        //console.log(myobj_serialized);
        //taking the string from the and reversing it as object
        const myobj_deserialized=JSON.parse(localStorage.getItem('myobj',myobj_serialized));
        console.log(myobj_deserialized);*/
        /*let retrive_submission=JSON.parse(localStorage.getItem(email.value));
        console.log(retrive_submission);*/
        nameInput.value=''
        email.value=''
        phonenumber.value=''
        schedule.value=''
    }
}