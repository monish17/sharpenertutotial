
const myform = document.querySelector('#myForm');
const  Email= document.querySelector("#Email");
const msg = document.querySelector('#msg');
const Password = document.querySelector('#Password');
// const forgotPassword=document.querySelector('#forgotPassword');
const forgotPasswordDiv=document.querySelector('#forgotPasswordDiv');


myform.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    //console.log(postLink.value, postDescription.value);
    if (Email.value.trim() === ''|| Password.value.trim()==='') {
        showMessage('Please Enter All the Fields');
    } else {
        const myobj = {
            Email:Email.value,
            Password:Password.value
        };
        signInData(myobj);
    }
}


function showMessage(message) {
    msg.style.color = 'red';
    msg.innerHTML = message;
    setTimeout(() => 
        {msg.style.color='transparent'}, 3000);
}

function signInData(myobj){
    axios.post('http://44.223.35.27:8000/routes/SignInData',myobj)
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
        // Email.value=""
        // Password.value=""
}

function openModel() {
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.getElementById('modal').style.display = 'block';
   document.getElementById('forgotPassword').style.display='none';
   document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  }

  function closeModal() {
    document.body.style.backgroundColor = '';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('forgotPassword').style.display='block';
  }

  document.getElementById('sendEmail').onclick= function(e){
    document.getElementById('modal').style.display = 'none';
    document.getElementById('forgotPassword').style.display='block';
    document.body.style.backgroundColor = '';
    console.log('button is clicked');
    const emailInput=document.getElementById('emailInput');
    axios.post('http://44.223.35.27:8000/password/forgotpassword',{"email":emailInput.value}).then().catch()
  }