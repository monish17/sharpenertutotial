const Product = require('../models/SignUpDataModel');
const bcrypt=require('bcrypt');
const token=require('jsonwebtoken');

const ExpenseData = require('../models/ExpenseDataModel');

function generateAccessToken(id){
  return token.sign({userId:id},'dune17');
}

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
              res.status(200).json({ message: 'User login In successful',token:generateAccessToken(result.ID)});
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
exports.postData = (req,res,next)=>{
  console.log("request arrived in postData");
  console.log(req.body);
  console.log('req.user>>',req.user);
    const userId=req.user;
  console.log("userId:",userId);
    const Expense_Amount = req.body.Expense_Amount;
    const description = req.body.description;
    const category = req.body.category;
    ExpenseData.create({
        Expense_Amount:Expense_Amount,
        description  : description ,
        category: category,
        SignUpDatumID:userId
    }).then(result =>{
      res.json({
          expense: { 
              id: result.id, 
              Expense_Amount: Expense_Amount,
              description: description,
              category: category
          }
      })
      console.log(result);
    }).catch(err =>{
        console.log(err);
    })
}
exports.retrieveData= (req,res,next)=>{
  console.log('request arrived');
  ExpenseData.findAll({where:{SignUpDatumId:req.user}})
    .then(data => {
        console.log(data);
        res.json(data);
      })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
}

exports.deleteData = (req,res,next)=>{
  console.log('delete request arrived');
  console.log(req.params);
  const id = req.params.hiddenIdValue;
  ExpenseData.destroy({
      where: {
          id: id
      }
  })
  .then(result => {
      if (result === 0) {
          return res.status(404).json({ message: 'id not found' });
        }

      res.status(200).json({ message: true });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  });

}