const express=require('express');
const fs=require('fs');
const router=express.Router();

router.get('/', (req, res, next) => {
    //below code will read from the chatdata.txt file if it exists or else show no chats exists
    //after that it will move on to the next line res.send Note: readfile is a Async function
    //here we create another 2 key value pairs one is message:value from the input bar
    //2nd we have a another input bar with type=hidden which makes the input bar hidden we are not gonna
    //enter anything in it we just assign the value in that input bar to value of username in the local storage
    // 2nd key value pair would be username:value from the local storage stored prevuiously during the /login time
    
    fs.readFile("chatdata.txt",(err,data)=>{
        if(err){
            console.log(err);
            data='no chats exists';
        }
        res.send(
         `${data}<form action="/" onsubmit="document.getElementById('username').value=localStorage.getItem('username')" method="POST">
            <input id="message" name="message" type="text" placeholder="message">
            <input type="hidden" name="username" id="username">
            <button type="submit">send</button>
        </form>
    `);
    })
    
});

router.post('/',(req,res,next)=>{
    console.log(req.body.message);
    console.log(req.body.username);
    fs.writeFile("chatdata.txt",`${req.body.username}:${req.body.message}`,{flag:'a'},(err)=>
        err?console.log(err):res.redirect('/')
    );
});
module.exports=router;
