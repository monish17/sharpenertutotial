require('dotenv').config();

const User=require('../Models/SignUpData');

const bcrypt=require('bcrypt');

const token=require('jsonwebtoken');

function generateAccessToken(id,key){
    const SALT=process.env.SALT;
    return token.sign({userId:id,isPremiumUser:key},SALT);
  }


exports.SignUpData=async(req,res,next)=>{
    console.log("request arrived in signUpData");
    console.log(req.body);
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Password = req.body.Password;
    const PhoneNumber=req.body.PhoneNumber;
    try {
        const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(Password, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
        });

        await User.create({ Name, Email,PhoneNumber, Password: hash });
        res.status(201).json({ message: 'Successfully user registered' });
    } catch (err) {
        console.log("line 62>>>",err);
        if (err.name==='SequelizeUniqueConstraintError') {
            res.json({ message: 'Name or Email Id Already registered' });
        } else {
            res.json({ message: 'Internal Server Error' });
        }
    }
}

exports.SignInData=async(req,res,next)=>{
    console.log('Request Arrived in SignInData controller');
    console.log("req.body>>>",req.body);
    const Email = req.body.Email;
    const Password = req.body.Password;
    try {
        const result = await User.findOne({
            where: {
                Email: Email
            }
        });
        console.log("result>>>",result);
        if (result) {
            bcrypt.compare(Password,result.Password,(err,response)=>{
                if(err){
                res.status(500).json({message:'something went wrong'});
                }
                if(response===true){
                    res.status(200).json({ message: 'User login In successful',token:generateAccessToken(result.ID,),Name:result.Name});
                }else{
                    res.status(401).json({message:'Password Incorrect'});
                }
            })}
        else {
            res.status(404).json({ message: 'User Not Found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

