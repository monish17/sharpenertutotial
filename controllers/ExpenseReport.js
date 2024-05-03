const ExpenseData = require('../models/ExpenseDataModel');

const S3URLModel=require('../models/S3URLModel');

exports.ExpenseReport=async(req,res,next)=>{
    console.log("Request Arrived in the Expense Report function");
    try{
        const response=await ExpenseData.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
        console.log(response);
        res.status(200).json({expense:response});
    }catch(err){
        console.log(err);
    }
}

exports.getURl= async(req,res,next)=>{
    console.log("request arrived in the getUrl controller>>>>>>>>>>>>");
    try{
        const response=await S3URLModel.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
        console.log(response);
        let URL=[];
        let FileName=[];
        response.forEach(object => {
            URL.push(object.dataValues.URL);
            FileName.push(object.dataValues.FileName);
        });
        console.log(URL,FileName);
        res.status(200).json({URLArray:URL,FileNameArray:FileName});
    }catch(err){
        console.log(err);
    }
}