const myform = document.querySelector('#myForm');
const Name = document.querySelector('#Name');
const  Email= document.querySelector("#Email");
const msg = document.querySelector('#msg');
const Password = document.querySelector('#Password');


myform.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    //console.log(postLink.value, postDescription.value);
    if (Name.value.trim() === '' || Email.value.trim() === ''|| Password.value.trim()==='') {
        showMessage('Please Enter All the Fields');
    } else {
        const myobj = {
            Name:Name.value,
            Email:Email.value,
            Password:Password.value
        };
        signUpData(myobj);
    }
}


function showMessage(message) {
    msg.style.color = 'red';
    msg.innerHTML = message;
    setTimeout(() => 
        {msg.style.color='transparent'}, 3000);
}

function signUpData(myobj){
    axios.post('http://localhost:8000/SignUpData',myobj)
        .then((response)=>{
            console.log(response);
            if(response.data.message==='Name or Email Id Already registered'||response.data.message==='Internal Server Error'){
                showMessage(response.data.message);
            }else{
                window.location.href="../signIn/SignInFrontend.html"
            }
            
            
            // Name.value=""
            // Email.value=""
            // Password.value=""
        })
        .catch(err => console.log(err));
}