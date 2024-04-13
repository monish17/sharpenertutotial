// const Product = require('../models/SignUpDataModel');
// const bcrypt=require('bcrypt');
// const token=require('jsonwebtoken');

// const ExpenseData = require('../models/ExpenseDataModel');

const Razorpay=require('razorpay');

const Order=require('../models/orders');

exports.premiummembership=async(req,res,next)=>{
    console.log(process.env.RAZORPAY_KEY_ID);
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
                // order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(()=>{
                //     req.user.update({isPremiumUser:true}).then(()=>{
                //         return res.status(202).json({sucess:true,message:"Transaction Successful"});
                //     }).catch((err)=>{
                //         throw new Error(err);
                //     })
                // }).catch((err)=>{
                //     throw new Error(err);
                // })
                const updateOrderPremium=order.update({paymentid:payment_id,status:'SUCCESSFUL'});
                const updateUserPremium=req.user.update({isPremiumUser:true});
                Promise.all([updateOrderPremium,updateUserPremium]).then(()=>{
                    return res.status(202).json({sucess:true,message:"Transaction Successful"});
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