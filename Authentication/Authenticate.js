const User=require('../Models/SignUpData');
const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    try{
        const Token=req.header('Authorization');
        console.log('token',Token);
        console.log("request arrived in authentication ");
        const user=jwt.verify(Token,`${process.env.SALT}`);
        User.findByPk(user.userId).then(userTable=>{
            // console.log("userTable",userTable);
            req.user=userTable;
            next()
        })
    }
    catch(err){
        console.log(err);
        res.status(401).json({sucess:false});
    }
}

module.exports={
    authenticate
}