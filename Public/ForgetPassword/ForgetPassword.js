

document.getElementById('sendEmail').onclick= function(e){
    console.log('button is clicked');
    const emailInput=document.getElementById('emailInput');
    console.log(emailInput.value);
    axios.post(`http://52.172.50.43:3000/password/forgotpassword`,{"email":emailInput.value}).
    then(response =>{
      //console.log(response);
      window.location.href="../SignIn/SignIn.html";
    })
    .catch(err =>{
      console.log(err)
    }
    )
  }