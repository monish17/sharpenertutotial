const chatBody=document.querySelector('#Chat-Body');
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');
const Token=localStorage.getItem('Token');


sendButton.addEventListener('click',()=>{
    const myobj={
        Message:chatInputBar.value
    }
    axios.post(`http://localhost:3000/Messages/postMessage`,myobj,{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
        alert('Message Stored');
    })
    .catch(err => {
        console.log(err);
    });
})


window.addEventListener("DOMContentLoaded",()=>{
    console.log(Token);
    axios.get(`http://localhost:3000/Messages/getMessage`,{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
        alert('Message Retrieved');
    })
    .catch(err => {
        console.log(err);
    });
})