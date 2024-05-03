const ExpenseData = require('../models/ExpenseDataModel');
exports.getExpenses=(req)=>{
    return ExpenseData.findAll({where:{SignUpDatumID:req.user.dataValues.ID}})
}