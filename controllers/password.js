const Sib=require('sib-api-v3-sdk');

const User=require('../models/SignUpDataModel');

const forgotPasswordModel=require('../models/forgotPassword');

require('dotenv').config


exports.forgotpassword= async(req,res,next)=>{
    console.log('Request Arrived in Forgot password controller>>>>>>>>>>>>>>>>>>>>>');
    console.log(req.body);

    try{
        const result = await User.findOne({
            where: {
                Email: req.body.email
            }
        });
        console.log(result);
        try{
            const forgotPasswordTable= await forgotPasswordModel.create({
                userId:result.dataValues.ID,
                isActive:true
            })    
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }

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