import config from '../CONFIG.js';

const myform = document.querySelector('#signUpForm');
const Name = document.querySelector('#nameInput');
const  Email= document.querySelector("#emailInput");
const msg = document.querySelector('#msg');
const Password = document.querySelector('#passwordInput');


myform.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    //console.log(postLink.value, postDescription.value);
    const myobj = {
        Name:Name.value,
        Email:Email.value,
        Password:Password.value
    }
    console.log('SignUp request sent');
    signUpData(myobj);
}

function showMessage(message) {
    msg.style.color = 'red';
    msg.innerHTML = message;
    setTimeout(() => 
        {msg.style.color='transparent'}, 3000);
}

function signUpData(myobj){
    axios.post(`http://52.172.46.245:3000/routes/SignUpData`,myobj)
        .then((response)=>{
            console.log(response);
            if(response.data.message==='Name or Email Id Already registered'||response.data.message==='Internal Server Error'){
                showMessage(response.data.message);
            }else{
                window.location.href="../SignIn/SignIn.html";
            }
            
            
            // Name.value=""
            // Email.value=""
            // Password.value=""
        })
        .catch(err => console.log(err));
}