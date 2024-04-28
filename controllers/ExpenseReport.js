const ExpenseData = require('../models/ExpenseDataModel');

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