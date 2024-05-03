const Product = require('../models/SignUpDataModel');
const bcrypt=require('bcrypt');
const token=require('jsonwebtoken');

const ExpenseData = require('../models/ExpenseDataModel');

const User=require('../models/SignUpDataModel');

const sequelize=require('../util/database');

const AWS=require('aws-sdk');

const { Body } = require('sib-api-v3-sdk');

const UserServices=require('../services/userServices');

const S3Services=require('../services/s3Services');


function generateAccessToken(id,key){
  const SALT=process.env.SALT;
  return token.sign({userId:id,isPremiumUser:key},SALT);
}

function uploadToS3(data,fileName){
  const BUCKET_NAME= process.env.BUCKET_NAME;
  const IAM_USER_KEY= process.env.IAM_USER_KEY;
  const IAM_USER_SECRET= process.env.IAM_USER_SECRET;

  let s3bucket=new AWS.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET
  })

    var params={
      Bucket:BUCKET_NAME,
      Key:fileName,
      Body:data,
      ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
      s3bucket.upload(params,(err,s3respnse)=>{
        if(err){
          console.log("Something went wrong",err);
          reject(err);
        }else{
          console.log("success",s3respnse);
          resolve(s3respnse.Location);
        }
      })
    })
    
}


exports.SignInData = async (req, res, next) => {
  console.log("request arrived in SignInData");
  // console.log("req.body>>>",req.body);
  const Email = req.body.Email;
  const Password = req.body.Password;
  try {
      const result = await Product.findOne({
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
              if(result.dataValues.isPremiumUser=== true){
                res.status(200).json({ message: 'User login In successful',token:generateAccessToken(result.ID,true)});
              }else{
                res.status(200).json({ message: 'User login In successful',token:generateAccessToken(result.ID,null)});
              }
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
  console.log("request arrived in signUpData");
  //console.log(req.body);
  const Name = req.body.Name;
  const Email = req.body.Email;
  const Password = req.body.Password;
  try {
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(Password, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    await Product.create({ Name, Email, Password: hash });
    res.status(201).json({ message: 'Successfully user registered' });
  } catch (err) {
      console.log("line 62>>>",err);
      if (err.name==='SequelizeUniqueConstraintError') {
          res.json({ message: 'Name or Email Id Already registered' });
      } else {
          res.json({ message: 'Internal Server Error' });
      }
  }
};
exports.postData = async (req, res, next) => {
  console.log("request arrived in postData");
  const userId = req.user.dataValues.ID;
  const Expense_Amount = req.body.Expense_Amount;
  const description = req.body.description;
  const category = req.body.category;
  const transact = await sequelize.transaction(); 

  try {
      const result = await ExpenseData.create({
          Expense_Amount: Expense_Amount,
          description: description,
          category: category,
          SignUpDatumID: userId
      },{transaction:transact});
      //console.log('line 93>>>>>', result);
      try {
          await User.increment('TotalExpense', {
              by: parseInt(result.dataValues.Expense_Amount),
              where: { ID: result.dataValues.SignUpDatumID },
              transaction:transact
          });
      //console.log('line 108>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
          await transact.commit();
          res.json({
            expense: {
                id: result.dataValues.id,
                Expense_Amount: Expense_Amount,
                description: description,
                category: category
            }
          });
      } catch (err) {
          console.log(err);
          await transact.rollback();
      }
  } catch (err) {
      console.log(err);
      await transact.rollback(); 
  }
};

exports.retrieveData= (req,res,next)=>{
  console.log('request arrived');
  //console.log(req.user);
  ExpenseData.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
    .then(data => {
        //console.log(data);
        res.json(data);
      })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
}

exports.deleteData = async(req,res,next)=>{
  console.log('delete request arrived');
  console.log(req.body);
  //console.log(req.user);
  const id = req.params.hiddenIdValue;
  const userId=req.user.dataValues.ID;
  const transact = await sequelize.transaction(); 
  try{
    const result=await ExpenseData.destroy({
      where: {
          id: id,
          SignUpDatumID:userId
      },
      transaction:transact
    })
    try{
      await User.decrement('TotalExpense', {
        by: parseInt(req.body.expenseAmount),
        where: { ID: userId },
        transaction: transact
      });
      await transact.commit()
      if (result === 0) {
        return res.status(404).json({ message: 'id not found' });
      }
      res.status(200).json({ message: true });
    }catch(err){
      console.log(err);
      await transact.rollback()
    }
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
    await transact.rollback()
  }
}

exports.downloadData=async (req,res,next)=>{
  try{
    console.log('request arrived in downloadData>>>>>>>>>>>');
    const expenses=await UserServices.getExpenses(req);
    const stringfiedData=JSON.stringify(expenses); 
    const userId=req.user.dataValues.ID;
    const fileName=`expense${userId}/${new Date()}.txt`;
    const fileUrl= await S3Services.uploadToS3(stringfiedData,fileName);
    console.log(fileUrl);
    const urlTable=await S3Services.S3URLTable(fileUrl.Location,userId,fileUrl.key);
    res.status(200).json({fileUrl:fileUrl.Location,success:true,FileName:fileName});    
  }catch(err){
    console.log(err);
    res.status(500).json({fileUrl:'',success:false,err:err});
  }
                          
}