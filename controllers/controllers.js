const Product = require('../models/SignUpDataModel');

exports.SignUpData = (req,res,next)=>{
    console.log("request arrived");
      console.log(req.body);
      //const id = req.body.id;
      const Name = req.body.Name;
      const Email = req.body.Email;
      const Password = req.body.Password;
      Product.create({
          Name:Name,
          Email:Email,
          Password:Password
      }).then(result =>{
        res.json({
            SignUpData: { 
                Name:Name,
                Email:Email,
                Password:Password
            }
        })
        console.log(result);
      }).catch(err =>{
          console.log(err);
          if(err.name='SequelizeUniqueConstraintError'){
            res.json({message:'Name or Email Id Already registered'})
          }else{
            res.json({message:'Internal Server Error'})
          }
      })
  }
