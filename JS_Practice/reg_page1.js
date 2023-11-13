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
        const edit=document.createElement('input');
        edit.type='button';
        edit.value='Edit';
        del.addEventListener('click',deleteclick);
        function deleteclick(e){
            const li = e.target.closest('li');
            if (li) {
                const liText=li.textContent;
                const parts = liText.split(':');
                const emailValue = parts[1].trim();
                axios.get('https://crudcrud.com/api/bbe3477b4f82459f8c2b294888090db4/userData')
                    .then((response)=>{
                        const dataToDelete=response.data.find(entry => entry.email === emailValue);
                        if(dataToDelete){
                            console.log(dataToDelete);
                            const user_id=dataToDelete._id;
                            axios.delete(`https://crudcrud.com/api/bbe3477b4f82459f8c2b294888090db4/userData/${user_id}`)
                                .then((deleteresponse)=>{
                                    console.log(deleteresponse);
                                    li.remove();
                                    console.log('user Details deleted from the server');
                                })
                                .catch((error)=>{
                                    console.log(error);
                                    console.log('something wrong in the axios.delete of dataToDelete');
                                })
                        }
                        else{
                            console.log('Entry not found for deletion');
                        }

                    })
                    .catch((err)=>{
                        console.log(err);
                        console.log('error happening on the axios.get function of deleteClick function')
                    })
             }
        }
        edit.addEventListener('click',edititem);
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
        axios.post("https://crudcrud.com/api/bbe3477b4f82459f8c2b294888090db4/userData",myobj)
            .then((Response)=>{
                console.log(Response);
                console.log('uploaded to the server')
            })
            .catch((err)=>{
                console.log(err);
                console.log('Error in the axios.post line code');
            })
        nameInput.value=''
        email.value=''
        phonenumber.value=''
        schedule.value=''
    }
}