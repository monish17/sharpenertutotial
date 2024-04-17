const User=require('../models/SignUpDataModel');

const ExpenseData=require('../models/ExpenseDataModel');
const sequelize = require('../util/database');
// const { default: orders } = require('razorpay/dist/types/orders');

exports.getLeadershipBoard=async (req,res,next)=>{
    // console.log('leadershipBoard');
    try{
        const leadershipBoard=await User.findAll({
            attributes:['ID','Name',[sequelize.fn('sum',sequelize.col('Expense_Amount')),'totalCost']],
            include:[
                {
                    model:ExpenseData,
                    attributes:[]
                }
            ],
            group: ['ID'],
            order:[['totalCost','DESC']]
        });
        console.log('line 11 >>>>>>>>>>>>>',leadershipBoard);
         res.status(200).json(leadershipBoard);
    }catch(err){
        console.log(err);
    }
    
}