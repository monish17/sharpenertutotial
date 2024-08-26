const AWS=require('aws-sdk');

const AZUREURLTable=require('../models/AZUREURLTABLE');

exports.uploadToS3=async(data, fileName)=> {
  console.log('Request Arrived in S3', data);
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  const s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
  });

  const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
          if (err) {
              console.log("Something went wrong", err);
              reject(err);
          } else {
              console.log("Success", s3response);
              resolve(s3response.Location);
          }
      });
  });
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

