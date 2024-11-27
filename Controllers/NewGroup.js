require('dotenv').config();
const crypto=require('crypto');
const { Op } = require('sequelize');
const CreateGroup=require('../Models/NewGroupCreation');
const UserGroupRelation=require('../Models/UserGroupRelation');
const sequelize = require('../util/database');
const TotalUserData=require('../Models/SignUpData');
const { default: Message } = require('tedious/lib/message');

exports.createNewGroup= async(req,res,next)=>{
    console.log("request arrived in CreateNewGroup ");
    const NAME = req.body.GroupName;
    const CREATED_BY = req.user.dataValues.ID;
    const INVITE_TOKEN = crypto.randomBytes(16).toString('hex');
    // console.log(INVITE_TOKEN); 
    // console.log(CREATED_BY);
    const transact = await sequelize.transaction(); 
    try{
        const newGroup=await CreateGroup.create({NAME,CREATED_BY,INVITE_TOKEN},{transaction:transact});
        const GROUP_ID=newGroup.GROUP_ID;
        const USER_ID=req.user.dataValues.ID;
        const ISADMIN=true; 
        const UserGroupRelations=await UserGroupRelation.create({GROUP_ID, USER_ID,ISADMIN},{transaction:transact});
        await transact.commit();
        res.status(201).json({ message: 'Group-Created' ,
            GROUP_ID: newGroup.GROUP_ID,
        });
    }catch(err){
        console.log(err);
        await transact.rollback();
        res.status(500).json({ message: 'Group creation failed', error: err.message });
    }
}

exports.verifyUser=async(req,res,next)=>{
    console.log('Request Arrived in verifyUser');
    const GROUP_ID = req.params.Group_Id;
    const INVITE_TOKEN = req.params.Invite_Token || null;
    const USER_ID = req.user.dataValues.ID;
    // console.log('GroupId and User_Id',USER_ID,GROUP_ID);
    try {
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: GROUP_ID,
                USER_ID: USER_ID
            }
        });
        if (userInGroup) {
            res.status(200).json({ message: 'User belongs to the group',Admin: userInGroup.dataValues.ISADMIN});
        } else if(INVITE_TOKEN){       
           try{
            const ISADMIN=false;
            const createUserGroupRelation = await UserGroupRelation.create({GROUP_ID,USER_ID,ISADMIN});
            res.status(200).json({ message: 'User belongs to the group' });
           }catch(err){
            console.log(err);
           }
        }else{
            res.status(404).json({ message: 'User does not belong to the group' });
        }
    } catch (err) {
        console.log('error>>>>>>>>>>>>>>>>>>>>>>>>>>',err);
        res.status(500).json({ message: 'Error checking group membership', error: err.message });
    }
};

exports.getListOfGroups=async(req,res,next)=>{
    console.log('Request Arrived in ListOfGroups Controller');
    const UserId=req.user.dataValues.ID;
    // console.log(UserId);
    try{
        const ListOfGroupId=await UserGroupRelation.findAll({
            where: {
                USER_ID: UserId
              },
              include: [{
                model: CreateGroup, // Join the CustomGroups table
                attributes: ['NAME'] // Only retrieve the group name from CustomGroups
              }],
              attributes: ['GROUP_ID'] // Retrieve only GROUP_ID from UserGroupRelation
        
        });
        res.status(200).json({ListOfGroupIds:ListOfGroupId});
        // console.log(ListOfGroupId);
    }catch(err){
        console.log(err);
    }
}

exports.getInviteLink=async(req,res,next)=>{
    console.log('Request Arrived in getInviteLink');
    const Group_Id = req.params.Group_Id;
    const User_Id = req.user.dataValues.ID;
    // console.log(Group_Id,User_Id);
    try{
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: Group_Id,
                USER_ID: User_Id
            }
        });
        if (userInGroup) {
            const GroupSet=await CreateGroup.findOne({
                where: {
                   GROUP_ID:Group_Id
                }
            })
            if(GroupSet){
                // console.log(GroupSet);
                res.status(200).json({INVITE_TOKEN:GroupSet.INVITE_TOKEN});
            }
        }else{
            res.status(501).json({Message:'User Not Belong to the Group'});
        }
    }catch(err){
        console.log(err);
    }
}

exports.getGroupMembers=async(req,res,next)=>{
    console.log('REquest Arrived in the getGroupMembers Controller>>>>>>>>>>>>>>>>>>>>>>>>>');
    const Group_Id = req.params.Group_Id;
    // console.log(Group_Id);
   try{
        if(Group_Id==0){
            const userInGroups = await TotalUserData.findAll({
                attributes: ['Name']
            });
            res.status(200).json({Data :userInGroups});
        }else{
            const userInGroups = await UserGroupRelation.findAll({
                where: {
                    GROUP_ID: Group_Id
                },
                attributes:['USER_ID','ISADMIN'],
                include: [
                    {
                      model: TotalUserData, // Include the user details
                      attributes: ['Name'] // Only fetch the 'Name' column
                    }
                  ]
            });
            // console.log('UsersInGroups>>>>>>>>>>>>>>>>>>',userInGroups);
            res.status(200).json({Data :userInGroups});
        }
   } catch(err){
    console.log(err);
   }
}

exports.getProfile=async(req,res,next)=>{
    console.log('Request Arrived in getProfile');
    const searchValue=req.params.searchValue;
    const Group_Id=req.params.Group_Id;
    try{
        const userProfile= await TotalUserData.findAll({
            where: {
                [Op.or]: [
                    { Name: searchValue },
                    { PhoneNumber: searchValue}
                ]
            },
            attributes:['ID','Name']

        })
        if(userProfile && userProfile.length > 0){
            const userInGroup = await UserGroupRelation.findOne({
                where: {
                    GROUP_ID: Group_Id,
                    USER_ID: userProfile[0].dataValues.ID
                }
            });
            if(userInGroup){
                res.status(200).json({Details:userProfile,Member:true});
            }else{
                res.status(200).json({Details:userProfile,Member:false});
            }
        }else{
            res.status(201).json({Details:'User Not Found'});
        }
    }catch(err){
       console.log(err); 
    }
}

exports.addToGroup=async(req,res,next)=>{
    console.log('request arrived in Add to Group Controller');
    const USER_ID=req.params.value;
    const GROUP_ID=req.params.Group_Id;
    const ID=req.user.dataValues.ID;
    //verifying the user
    try{
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: GROUP_ID,
                USER_ID: ID
            }
        });
        if(userInGroup && userInGroup.dataValues.ISADMIN){
            const ISADMIN=false;
            const addUserToGroup=await  UserGroupRelation.create({GROUP_ID, USER_ID,ISADMIN});
            // console.log(addUserToGroup);
            res.status(200).json({Message:'User Added Successfully'});
        }else{
            res.status(500).json({Message:'Invalid Access'});
        }
    }catch(err){
        console.log(err);
    }
}

exports.makeAsAdmin=async(req,res,next)=>{
    console.log('Request arrived in makeAsAdmin controller');
    const USER_ID=req.params.value;
    const GROUP_ID=req.params.Group_Id;
    const ID=req.user.dataValues.ID;
    try{
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: GROUP_ID,
                USER_ID: ID
            }
        });
        if(userInGroup && userInGroup.dataValues.ISADMIN){
            const updatedUser = await UserGroupRelation.update(
                { ISADMIN: true },  
                {
                    where: {
                        GROUP_ID: GROUP_ID,
                        USER_ID: USER_ID  
                    }
                }
            );
            if (updatedUser[0] > 0) {
                res.status(200).json({ Message: 'User successfully made an admin' });
            } else {
                res.status(404).json({ Message: 'User not found in the group' });
            }        
        }else{
            res.status(500).json({Message:'Invalid Access'});
        }
    }catch(err){
        console.log(err);
    }
}

exports.removeFromGroup=async(req,res,next)=>{
    console.log('Request Arrived in REmoveFromGroup Controller');
    const USER_ID=req.params.value;
    const GROUP_ID=req.params.Group_Id;
    const ID=req.user.dataValues.ID;
    try{
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: GROUP_ID,
                USER_ID: ID
            }
        });
        if(userInGroup && userInGroup.dataValues.ISADMIN){
            const deleteUser= await UserGroupRelation.destroy({
                where:{
                    GROUP_ID: GROUP_ID,
                    USER_ID: USER_ID
                }
            })
            if (deleteUser > 0) {
                res.status(200).json({Message:"User Removed From Group"});
            } else {
               res.status(500).jsonn({Message:"Error User Not Found"});
            }
        }
    }catch(err){
        res.status(500).jsonn({Message:"Invalid Authorisation"});
    }
}

exports.dismissAsAdmin=async(req,res,next)=>{
    console.log('REquest Arrived in dismissAsAdmin');
    const USER_ID=req.params.value;
    const GROUP_ID=req.params.Group_Id;
    const ID=req.user.dataValues.ID;
    try{
        const userInGroup = await UserGroupRelation.findOne({
            where: {
                GROUP_ID: GROUP_ID,
                USER_ID: ID
            }
        });
        if(userInGroup && userInGroup.dataValues.ISADMIN){
            const dismissAdmin= await UserGroupRelation.update(
                { ISADMIN: false },  
                {
                    where: {
                        GROUP_ID: GROUP_ID,
                        USER_ID: USER_ID  
                    }
                }
            );
            // console.log(dismissAdmin);
            if (dismissAdmin[0] > 0) {
                res.status(200).json({ Message: 'User successfully dismissed as admin' });
            } else {
                res.status(404).json({ Message: 'User not found in the group' });
            }   
        }
    }catch(err){
        res.status(500).json({Message:"Invalid Authorisation"});
    }
}