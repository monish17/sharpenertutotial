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
        li.appendChild(document.createTextNode(`${nameInput.value} : ${email.value}:${phonenumber.value}:${schedule.value}`));
        const separator=document.createTextNode(' ');
        li.append(separator);
        li.appendChild(del);
        ul.appendChild(li);
        const myobj={
            name:nameInput.value,
            email:email.value,
            phonenumber:phonenumber.value,
            schedule:schedule.value
        }
        //localStorage.setItem(email.value,JSON.stringify(myobj));
        axios.post("https://crudcrud.com/api/4202aa9a4a6e451bb752d7169c8be646/data",myobj)
            .then((Response)=>{
                console.log(Response);
            })
            .catch((err)=>{
                console.log(err);
            })
        
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
function showNewUserOnScreen(user) {
    const li = document.createElement('li');
    const del = document.createElement('input');
    del.type = 'button';
    del.value = 'Delete';
    //const id=user.id
    del.addEventListener('click', deleteclick);

    function deleteclick(e) {
        const li = e.target.closest('li');
        if (li) {
            li.remove();
            // const liText = li.textContent;
            // const parts = liText.split(':');
            // const emailValue = parts[1].trim();
            const id=user._id;
            axios.delete(`https://crudcrud.com/api/4202aa9a4a6e451bb752d7169c8be646/data/${id}`)
                .then((response)=>{
                    console.log(response);
                })
                .catch((err)=>{
                    console.log(err);
                    console.log('error happening on the link')
                })
        }
    }

    li.appendChild(document.createTextNode(`${user.name} :   ${user.email}:  ${user.phonenumber}:  ${user.schedule}`));
    const separator = document.createTextNode(' ');
    li.append(separator);
    li.appendChild(del);
    ul.appendChild(li);
}
window.addEventListener("DOMContentLoaded",()=>{
    axios.get("https://crudcrud.com/api/4202aa9a4a6e451bb752d7169c8be646/data")
        .then((response)=>{
            console.log(response)
            for(var i=0;i<response.data.length;i++){
                showNewUserOnScreen(response.data[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })
})