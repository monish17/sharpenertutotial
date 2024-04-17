// const Product = require('../models/SignUpDataModel');
// const bcrypt=require('bcrypt');
// const token=require('jsonwebtoken');

// const ExpenseData = require('../models/ExpenseDataModel');
const token=require('jsonwebtoken');

const Razorpay=require('razorpay');

const Order=require('../models/orders');

exports.premiummembership=async(req,res,next)=>{
    console.log(process.env.RAZORPAY_KEY_ID);
    console.log('line14 in premiummembership congroller');
    try{
        var rzp=new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        rzp.orders.create({amount,currency:'INR'},(err,order)=>{ 
            if(err){
                console.log(err);
                throw new Error(JSON.stringify(err)); 
            }
            req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
                console.log('line 27 creatingOrder is working');
                return res.status(201).json({order,key_id:rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            });
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message:"something went Wrong",error:err});
    }
}

exports.updateTransactionStatus=(req,res)=>{
    try{
        const{payment_id,order_id}=req.body;
        const user=req.user.dataValues.ID;
        console.log(user);
        console.log(req.body);
        console.log(payment_id,order_id);  //
        if(req.body.Response && req.body.Response.error && req.body.Response.error.reason){
            Order.findOne({where:{orderid:order_id}}).then(order=>{
                const updateOrderPremium=order.update({paymentid:payment_id,status:'Failure'});
                const updateUserPremium=req.user.update({isPremiumUser:false})
                Promise.all([updateOrderPremium,updateUserPremium]).then(()=>{
                    return res.status(202).json({sucess:false,message:"Transaction Failed"});
                }).catch((err)=>{
                    console.log(err);
                    throw new Error(err);
                })
            })
        }else{
            Order.findOne({where:{orderid:order_id}}).then(order=>{
                const updateOrderPremium=order.update({paymentid:payment_id,status:'SUCCESSFUL'});
                const updateUserPremium=req.user.update({isPremiumUser:true});
                Promise.all([updateOrderPremium,updateUserPremium]).then(()=>{
                    return res.status(202).json({sucess:true,message:"Transaction Successful",token:generateAccessToken(user,true)});
                }).catch((err)=>{
                    console.log(err);
                    throw new Error(err);
                })
            }).catch((err)=>{
                throw new Error(err);
            })
        }

    }catch(err){
        console.log(err);
        throw new Error('error in updateTransactionStatus controller');
        
    }
}

function generateAccessToken(id,key){
    return token.sign({userId:id,isPremiumUser:key},'dune17');
  }