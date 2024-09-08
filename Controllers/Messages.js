require('dotenv').config();

const MessageDatabase=require('../Models/MessageStoring');

exports.MessageStoring=async(req,res,next)=>{
    console.log("request arrived in Message_Storing");
    console.log(req.body);
    const MESSAGE_CONTENT=req.body.Message;
    const USER_NAME=req.body.userName;
    const USER_ID = req.user.dataValues.ID;
    console.log(MESSAGE_CONTENT,USER_ID,USER_NAME);
    try{
        await MessageDatabase.create({ USER_ID,USER_NAME, MESSAGE_CONTENT });
        res.status(200).json({ Message: MESSAGE_CONTENT});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}

exports.RetrievingMessage=async(req,res,next)=>{
    console.log("request arrived in Message_Retrieving");
    try{
        const retrievedMessage=await MessageDatabase.findAll({
            limit:15,
            order:[['createdAt','DESC']]
        }
        )
        res.status(200).json({ Message: retrievedMessage.reverse()});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}