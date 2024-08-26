const ExpenseData = require('../models/ExpenseTrackingModel');

const AZUREURLTABLE=require('../models/AZUREURLTABLE');
const { AZUREURLTable } = require('../DownloadFile/AZURE');

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
        const response=await AZUREURLTABLE.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
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