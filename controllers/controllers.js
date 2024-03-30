const Product = require('../models/SignUpDataModel');

exports.SignInData = (req,res,next)=>{
    console.log("request arrived");
      console.log(req.body);
      const Email = req.body.Email;
      const Password = req.body.Password;
      Product.findOne({
        where: {
            Email: Email
        }
      }).then(result => {
            console.log(result);
            if(result){ 
              if(result.Password=== Password){
                res.json({message:'User login In successful'});
              }else{
                res.status(401).json({message:'User not Authoried'});
              }
            }else{
              res.status(404).json({message:'User Not Found'});
            }   
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};
