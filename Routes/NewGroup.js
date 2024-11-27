const express = require('express');

const router=express.Router();

const Authenticate=require('../Authentication/Authenticate');

const NewGroup=require('../Controllers/NewGroup');

router.post('/CreateGroup',Authenticate.authenticate,NewGroup.createNewGroup);

router.post('/VerifyUser/:Group_Id/:Invite_Token',Authenticate.authenticate,NewGroup.verifyUser);

router.post('/getProfile/:searchValue/:Group_Id',Authenticate.authenticate,NewGroup.getProfile);

router.post('/addToGroup/:value/:Group_Id',Authenticate.authenticate,NewGroup.addToGroup);

router.post('/makeAsAdmin/:value/:Group_Id',Authenticate.authenticate,NewGroup.makeAsAdmin);

router.get('/ListOfGroups',Authenticate.authenticate,NewGroup.getListOfGroups);

router.get('/generateToken/:Group_Id',Authenticate.authenticate,NewGroup.getInviteLink);

router.get('/GetGroupMembers/:Group_Id',Authenticate.authenticate,NewGroup.getGroupMembers);

router.post('/dismissAsAdmin/:value/:Group_Id',Authenticate.authenticate,NewGroup.dismissAsAdmin);

router.delete('/removeFromGroup/:value/:Group_Id',Authenticate.authenticate,NewGroup.removeFromGroup);

module.exports = router;