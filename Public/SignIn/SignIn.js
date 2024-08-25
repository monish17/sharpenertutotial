
const myform = document.querySelector('#signInForm');
const  Email= document.querySelector("#signInEmailInput");
const msg = document.querySelector('#msg');
const Password = document.querySelector('#signInPasswordInput');
// const forgotPassword=document.querySelector('#forgotPassword');
//const forgotPasswordDiv=document.querySelector('#forgotPasswordDiv');


myform.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    //console.log(postLink.value, postDescription.value);
    
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
    axios.post(`http://13.71.121.64:3000/routes/SignInData`,myobj)
        .then((response)=>{
            console.log(response);
            localStorage.setItem('Token',response.data.token);
            console.log(response.data.token);
            window.location.href="../Expense Tracker/ExpenseTracker.html"
        })
        .catch(err => {
            console.log(err)
            if(err.response.status===401||err.response.status===404||err.response.status===500){
                showMessage(err.response.data.message);
            }
        });
}