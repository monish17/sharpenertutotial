const AWS=require('aws-sdk');

const S3URLTable=require('../models/S3URLModel');

 exports.uploadToS3=(data,fileName)=>{
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
            resolve(s3respnse);
          }
        })
      })
      
  }

  exports.S3URLTable=async(url,userId,name,res)=>{
    return new Promise((resolve,reject)=>{
        try{
            const URLTable= S3URLTable.create({
                URL:url,
                SignUpDatumID:userId,
                FileName:name
            })
            //res.status(200).json({sucess:true});
            resolve();
        }catch(err){
            console.log(err);
            //res.status(500).json({sucess:false,Err:err});
            reject(err);
        }
    })
  }