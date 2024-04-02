const Product = require('../models/SignUpDataModel');
const bcrypt=require('bcrypt');

exports.SignInData = async (req, res, next) => {
  console.log("request arrived");
  console.log(req.body);
  const Email = req.body.Email;
  const Password = req.body.Password;
  try {
      const result = await Product.findOne({
          where: {
              Email: Email
          }
      });
      console.log(result);
      if (result) {
          bcrypt.compare(Password,result.Password,(err,response)=>{
            if(err){
              res.status(500).json({message:'something went wrong'});
            }
            if(response===true){
              res.status(200).json({ message: 'User login In successful' });
            }else {
              res.status(401).json({ message: 'User not Authorized' });
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
};

exports.SignUpData = async (req, res, next) => {
  console.log("request arrived");
  console.log(req.body);
  const Name = req.body.Name;
  const Email = req.body.Email;
  const Password = req.body.Password;
  try {
    bcrypt.hash(Password,10,async(err,hash)=>{
      //console.log(err)
      await Product.create({Name,Email,Password:hash});
      res.status(201).json({message:'sucessfully user registered'});
    })
  } catch (err) {
      console.log(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
          res.json({ message: 'Name or Email Id Already registered' });
      } else {
          res.json({ message: 'Internal Server Error' });
      }
  }
};
