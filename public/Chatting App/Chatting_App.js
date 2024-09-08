const chatBody=document.querySelector('#Chat-Body');
const chatUl=document.querySelector('#Chat-Ul')
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');
const Token=localStorage.getItem('Token');
const userName=localStorage.getItem('UserName');

let lastMessageId=null;

sendButton.addEventListener('click',()=>{
    const myobj={
        Message:chatInputBar.value,
        userName:userName
    }
    axios.post(`http://localhost:3000/Messages/postMessage`,myobj,{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
        postingMessage('NULL',chatInputBar.value);
        chatInputBar.value='';
    })
    .catch(err => {
        console.log(err);
    });
})


window.addEventListener("DOMContentLoaded",()=>{
        setInterval(function(){
            console.log(Token);
            axios.get(`http://localhost:3000/Messages/getMessage`,{headers:{'Authorization':Token}})
            .then((response)=>{
                console.log(response);
                for(var i=0;i<response.data.Message.length;i++){
                        let messageId=response.data.Message[i].ID;
                        if(messageId>lastMessageId){
                            postingMessage(response.data.Message[i].USER_NAME,response.data.Message[i].MESSAGE_CONTENT);
                            lastMessageId=messageId;
                        }
                }
            })
            .catch(err => {
                console.log(err);
            });
        },1000)
})


function postingMessage(USER_NAME,message){
    const usernameSpan = document.createElement('span');
    usernameSpan.setAttribute('class', 'Username');

    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'Message-Text');
    messageDiv.textContent = message;
    const li=document.createElement('li');
    console.log(USER_NAME);
    if(USER_NAME != 'NULL' && USER_NAME!=userName){
            li.setAttribute('class','Group-Message-Li');
            usernameSpan.textContent = USER_NAME;
        }else{
            li.setAttribute('class','Message-Li');
            usernameSpan.textContent = userName;
        }
    li.appendChild(usernameSpan);
    li.appendChild(messageDiv);
    chatUl.appendChild(li);
    chatUl.appendChild(document.createElement('br'));

}