//const Product = require('../models/SignUpDataModel');

require('dotenv').config();

const User=require('../models/SignUpDataModel');

const ExpenseTrackerModel=require('../models/ExpenseTrackingModel');

const bcrypt=require('bcrypt');

const token=require('jsonwebtoken');

const AWS=require('aws-sdk');


const UserServices=require('../DownloadFile/UserService');

const S3Services=require('../DownloadFile/S3Services');

const S3URLTable=require('../models/S3URLModel');

function generateAccessToken(id,key){
    const SALT=process.env.SALT;
    return token.sign({userId:id,isPremiumUser:key},SALT);
  }

const sequelize=require('../util/database');

exports.SignUpData=async(req,res,next)=>{
    console.log("request arrived in signUpData");
    console.log(req.body);
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

        await User.create({ Name, Email, Password: hash });
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
}

exports.PostData = async(req,res,next) => {
    console.log('Request Arrived');
    console.log(req.body);
    console.log(req.user);
    const Datatype=req.body.type;
    console.log(Datatype);
    const Expense_Amount = req.body.amount;
    const description = req.body.description;
    const userId = req.user.dataValues.ID;
    const transact = await sequelize.transaction(); 
    try{
        const result = await ExpenseTrackerModel.create({
        type:Datatype,
        Expense_Amount: Expense_Amount,
        description: description,
        SignUpDatumID: userId
        },{transaction:transact})
        try {
            if(Datatype==='Income'){
                await User.increment('TotalIncome', {
                    by: parseInt(result.dataValues.Expense_Amount),
                    where: { ID: result.dataValues.SignUpDatumID },
                    transaction:transact
                });
            }else{
                await User.increment('TotalExpense', {
                    by: parseInt(result.dataValues.Expense_Amount),
                    where: { ID: result.dataValues.SignUpDatumID },
                    transaction:transact
                });
            }
            await transact.commit();
            res.json({
              expense: {
                type:Datatype,
                  id: result.dataValues.id,
                  Expense_Amount: Expense_Amount,
                  description: description
              }
            });
        } catch (err) {
            console.log(err);
            await transact.rollback();
        }
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Error in post Data"});
        await transact.rollback(); 
    }
}

exports.retrieveData= async(req,res,next)=>{
    console.log('Request Arrived in the RetrieveData controller');
    const currentPage=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.pageLimit,10)||5;
    const offset=(currentPage-1)*limit;
    let totalItems=0;
    ExpenseTrackerModel.count({where:{SignUpDatumID:req.user.dataValues.ID}})
    .then((items)=>{
      totalItems=items;
      return ExpenseTrackerModel.findAll({where:{SignUpDatumID:req.user.dataValues.ID},
        limit:limit,
        offset:offset        
      })
      .then(data => {
        res.json({
        expense:data,
        hasPreviousPage:currentPage-1,
        hasNextPage:limit*currentPage < totalItems,
        nextPage:currentPage+1,
        currentPage:currentPage,
        lastPage:Math.ceil(totalItems/limit)
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    })
    .catch(err => console.log(err)
  );
    // ExpenseTrackerModel.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
    // .then((data)=>{
    //     res.json({
    //         message:"Got data",
    //         Data:data
    //     })
    // }).catch(err=>{
    //     console.log(err);
    // })
}

exports.deleteData = async(req,res,next)=>{
    console.log('delete request arrived');
    const id = req.params.hiddenIdValue;
    console.log(id);
    const userId=req.user.dataValues.ID;
    const transact = await sequelize.transaction(); 
    try{
      const result=await ExpenseTrackerModel.destroy({
        where: {
            id: id,
            SignUpDatumID:userId
        },
        transaction:transact
      })
      try{
        if(req.body.type==='Income'){
            await User.decrement('TotalIncome', {
                by: parseInt(req.body.expenseAmount),
                where: { ID: userId },
                transaction: transact
            });
            await transact.commit()
        }else{
            await User.decrement('TotalExpense', {
                by: parseInt(req.body.expenseAmount),
                where: { ID: userId },
                transaction: transact
            });
            await transact.commit()
        }
        if (result === 0) {
          return res.status(404).json({ message: 'id not found' });
        }
        res.status(200).json({ message: true });
      }catch(err){
        console.log('err1>>>>>>>>>>>>>>>>',err);
        await transact.rollback()
      }
    }catch(err){
      res.status(500).json({ error: 'Internal Server Error' });
      console.log('err2>>>>>>>>>>>>>>>>',err)
      await transact.rollback()
    }
  }

exports.getTotalTransaction=(req,res,next)=>{
    console.log('Request Arrived in the getTotaltransaction controller');
    User.findAll({where:{ID:req.user.dataValues.ID}})
    .then((data)=>{
        res.json({
            TotalExpense:data[0].dataValues.TotalExpense,
            TotalIncome:data[0].dataValues.TotalIncome
        })
    }).catch(err=>{
        console.log(err);
    })  
}

// exports.downloadData=async (req,res,next)=>{
//     console.log('request arrived in downloadData>>>>>>>>>>>');
//     // console.log('req>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',req);
//     const expenses=await  ExpenseTrackerModel.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
//     const stringfiedExpense=JSON.stringify(expenses);
//     console.log(stringfiedExpense);
//     const userId=req.user.dataValues.ID;
//     const fileName=`${userId}_Expense Report_${new Date()}`;
//     const fileUrl= uploadToS3(stringfiedExpense,fileName);
//     console.log("Expenses>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",expenses);
//     console.log("FileUrl and FileName>>>>>>>>>>>>>>>>",fileUrl,fileName);
//     res.status(200).json({fileUrl,success:true})
//     // try{
//     //   console.log('request arrived in downloadData>>>>>>>>>>>');
//     //   const expenses=await UserServices.getExpenses(req);
//     //   const stringfiedData=JSON.stringify(expenses); 
//     //   const userId=req.user.dataValues.ID;
//     //   const fileName=`expense${userId}/${new Date()}.txt`;
//     //   const fileUrl= await S3Services.uploadToS3(stringfiedData,fileName);
//     //   console.log(fileUrl);
//     //   const urlTable=await S3Services.S3URLTable(fileUrl.Location,userId,fileUrl.key);
//     //   res.status(200).json({fileUrl:fileUrl.Location,success:true,FileName:fileName});    
//     // }catch(err){
//     //   console.log(err);
//     //   res.status(500).json({fileUrl:'',success:false,err:err});
//     // }
                            
//   }

//   function uploadToS3(data,fileName){
//     console.log('Request Arrived in S3',data);
//     const BUCKET_NAME= process.env.BUCKET_NAME;
//     const IAM_USER_KEY= process.env.IAM_USER_KEY;
//     const IAM_USER_SECRET= process.env.IAM_USER_SECRET;
    
//       let s3bucket=new AWS.S3({
//         accessKeyId:IAM_USER_KEY,
//         secretAccessKey:IAM_USER_SECRET
//       })
//       s3bucket.createBucket=(()=>{
//         var params={
//           Bucket:BUCKET_NAME,
//           Key:fileName,
//           Body:data,
//           ACL:'public-read'
//         }
//         s3bucket.upload(params,(err,s3respnse)=>{
//           if(err){
//             console.log("Something went wrong",err);
//             // reject(err);
//           }else{
//             console.log("success",s3respnse);
//           }
//         });
//       })
// } 

exports.downloadData = async (req, res, next) => {
    console.log('request arrived in downloadData>>>>>>>>>>>');
    const expenses = await ExpenseTrackerModel.findAll({ where: { SignUpDatumID: req.user.dataValues.ID } });
    const stringfiedExpense = JSON.stringify(expenses);
    console.log(stringfiedExpense);
  
    const userId = req.user.dataValues.ID;
    const fileName = `${userId}_Expense Report_${new Date().toISOString()}.txt`; // Added .txt extension for clarity
  
    try {
      const fileUrl = await S3Services.uploadToS3(stringfiedExpense, fileName);
      console.log(fileUrl);
      const urlTable=await S3Services.S3URLTable(fileUrl,userId,fileName);
      res.status(200).json({ fileUrl,fileName, success: true });
    } catch (err) {
      console.log('Error uploading to S3:', err);
      res.status(500).json({ fileUrl: '', success: false, error: err.message });
    }
  };
 
exports.retrieveExpenseReport=(req,res,next)=>{
    console.log('Expense Report');
    ExpenseTrackerModel.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
    .then((data)=>{
        res.json({
            message:"Got data",
            Data:data
        })
    }).catch(err=>{
        console.log(err);
    })

}