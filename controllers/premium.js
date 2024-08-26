const User=require('../models/SignUpDataModel');

// const { default: orders } = require('razorpay/dist/types/orders');

exports.getLeadershipBoard=async (req,res,next)=>{
    console.log('leadershipBoard controller');
    try{
        const leadershipBoard=await User.findAll({
            attributes:['ID','Name','TotalExpense'],
            group: ['ID','Name','TotalExpense'],
            order:[['TotalExpense','DESC']]
        });
        console.log('line 11 >>>>>>>>>>>>>',leadershipBoard);
         res.status(200).json(leadershipBoard);
    }catch(err){
        console.log("Error in getLeadership function",err);
    }
    
}