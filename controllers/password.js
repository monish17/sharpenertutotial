const Sib=require('sib-api-v3-sdk');

require('dotenv').config


exports.forgotpassword=(req,res,next)=>{
    console.log('Request Arrived in Forgot password controller>>>>>>>>>>>>>>>>>>>>>');
    console.log(req.body);
    const client=Sib.ApiClient.instance

const apiKey=client.authentications['api-key']

apiKey.apiKey=process.env.BREVO_API_KEY

const tranEmailApi=new Sib.TransactionalEmailsApi()

const sender={
    email:'monishrithvi@gmail.com',
    name:'Monish Rithvi'

}

const receivers=[{
    email:`${req.body.email}`
}]

tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:"subscribe to us",
    htmlContent:`
    <h3>This is the message containing your otp pin for resetting your password  for dynamic email </h3>
    <a href="https://app.brevo.com/settings/keys/api ">visit</a>`
    // textContent:`this is a Trial email`
})
.then((res)=>console.log(res))
.catch((err)=>console.log(err))

}