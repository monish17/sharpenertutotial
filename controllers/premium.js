const User=require('../models/SignUpDataModel');

const ExpenseData=require('../models/ExpenseDataModel');
const sequelize = require('../util/database');
// const { default: orders } = require('razorpay/dist/types/orders');

exports.getLeadershipBoard=async (req,res,next)=>{
    // console.log('leadershipBoard');
    try{
        const leadershipBoard=await User.findAll({
            attributes:['ID','Name','TotalExpense'],
            group: ['ID'],
            order:[['TotalExpense','DESC']]
        });
        console.log('line 11 >>>>>>>>>>>>>',leadershipBoard);
         res.status(200).json(leadershipBoard);
    }catch(err){
        console.log(err);
    }
    
}