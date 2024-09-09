//const { default: Message } = require("tedious/lib/message");
const chatBody=document.querySelector('#Chat-Body');
const chatUl=document.querySelector('#Chat-Ul')
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');
const Token=localStorage.getItem('Token');
const userName=localStorage.getItem('UserName');

let lastMessageId=localStorage.getItem('lastMessageId');

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
            console.log(Token);
                let messages=localStorage.getItem('Messages');
                if(messages===null){
                    lastMessageId=-1;
                }else{
                    messages = JSON.parse(messages);
                    messages.forEach(message => {
                        // Example: Posting each message to the chat
                        postingMessage(message.USER_NAME, message.MESSAGE_CONTENT);
                    });
                }
                    setInterval(function(){
                        axios.get(`http://localhost:3000/Messages/getMessage/${lastMessageId}`,{headers:{'Authorization':Token}})
                        .then((response)=>{
                            console.log(response);
                            for(var i=0;i<response.data.Message.length;i++){
                                    let messageId=response.data.Message[i].ID;
                                    //localStorage.setItem(`Messages`,JSON.stringify(response.data.Message));
                                    if(messageId>lastMessageId){
                                        postingMessage(response.data.Message[i].USER_NAME,response.data.Message[i].MESSAGE_CONTENT);
                                        lastMessageId=messageId;
                                    }
                            }
                            localStorage.setItem('lastMessageId',lastMessageId);
                            let messagesArray = messages ? JSON.parse(messages) : [];
                            response.data.Message.forEach(newMessage => {
                                messagesArray.push(newMessage);
                                if (messagesArray.length > 10) {
                                    messagesArray.shift();
                                }
                            });
                            localStorage.setItem('Messages', JSON.stringify(messagesArray));
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    },5000)
                    
                    // setInterval(function(){
                    //     lastMessageId=localStorage.getItem('lastMessageId');
                    //     axios.get(`http://localhost:3000/Messages/getMessage/${lastMessageId}`,{headers:{'Authorization':Token}})
                    //     .then((response)=>{

                    //     })
                    //     .catch((err)=>{
                    //         console.log(err);
                    //     })

                    // })
     
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