const chatBody=document.querySelector('#Chat-Body');
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');

sendButton.addEventListener('click',()=>{
    const Token=localStorage.getItem('Token');
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

