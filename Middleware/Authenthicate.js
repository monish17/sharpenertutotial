const User=require('../models/SignUpDataModel');
const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    try{
        const Token=req.header('Authorization');
        console.log('token',Token);
        console.log("request arrived in authentication ");
        const user=jwt.verify(Token,'dune17');
        // console.log(user);
        // console.log('userId>>>',user.userId);
        User.findByPk(user.userId).then(userTable=>{
            // console.log(JSON.stringify(user));
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