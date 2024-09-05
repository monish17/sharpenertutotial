require('dotenv').config();

const User=require('../Models/SignUpData');

const bcrypt=require('bcrypt');

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
