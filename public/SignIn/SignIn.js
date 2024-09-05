const myform = document.querySelector('#signInForm');
const  Email= document.querySelector("#signInEmailInput");
const msg = document.querySelector('#msg');
const Password = document.querySelector('#signInPasswordInput');


myform.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
        console.log('Button clicked');
        const myobj = {
            Email:Email.value,
            Password:Password.value
        };
        signInData(myobj);
}


function showMessage(message) {
    msg.style.color = 'red';
    msg.innerHTML = message;
    setTimeout(() => 
        {msg.style.color='transparent'}, 3000);
}

function signInData(myobj){
    console.log('Requested Arrived at SignInData');
    axios.post(`http://localhost:3000/routes/SignInData`,myobj)
        .then((response)=>{
            console.log(response);
            localStorage.setItem('Token',response.data.token);
            console.log(response.data.token);
            alert('SignIn Successfull');
        })
        .catch(err => {
            console.log(err)
            if(err.response.status===401||err.response.status===404||err.response.status===500){
                showMessage(err.response.data.message);
            }
        });
}