const express=require('express');
const router=express.Router();

router.get('/login',(req,res,next)=>{
    //here when you are doing the submit it will create a key value pair with 'username' as constent
    //with value from the input bar like username:value from inputbar
    res.send('<form onsubmit="localStorage.setItem(`username`, document.getElementById(`username`).value)" action="/admin1/login" method="POST"><input id = "username"type="text" name="username"><br><button type="submit">login</button></form>');
})
router.post('/login',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
module.exports = router;