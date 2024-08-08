const ExpenseData = require('../models/S3URLModel');
exports.getExpenses=(req)=>{
    return ExpenseData.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
}