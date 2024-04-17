const User=require('../models/SignUpDataModel');

const ExpenseData=require('../models/ExpenseDataModel');

exports.getLeadershipBoard=async (req,res,next)=>{
    // console.log('leadershipBoard');
    try{
        const expenses=await ExpenseData.findAll();
        console.log(expenses);
        const user= await User.findAll();
        const userAggregatedExpenses={};
        const nameAndExpense=[];
        expenses.forEach((expense)=>{
            // console.log('line>>13',expense);
            if(userAggregatedExpenses[expense.dataValues.SignUpDatumID]){
                userAggregatedExpenses[expense.dataValues.SignUpDatumID]=userAggregatedExpenses[expense.dataValues.SignUpDatumID]+expense.dataValues.Expense_Amount;
            }else{
                userAggregatedExpenses[expense.dataValues.SignUpDatumID]=expense.dataValues.Expense_Amount;
            }
        })
        user.forEach((users)=>{
            nameAndExpense.push({name:users.dataValues.Name,totalCost:userAggregatedExpenses[users.dataValues.ID]||0})
        })
        // console.log(userAggregatedExpenses);
        nameAndExpense.sort((a,b)=>b.totalCost-a.totalCost);
        //console.log('nameAndExpense>>>>',nameAndExpense);
        res.status(200).json(nameAndExpense);
    }catch(err){
        console.log(err);
    }
    
}