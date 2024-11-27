// const { Button } = require("bootstrap");

const chatBody=document.querySelector('#Chat-Body');
const chatUl=document.querySelector('#Chat-Ul')
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');
const Title=document.querySelector('#header');
const InviteButton=document.querySelector('#Invite-Button');
const Token=localStorage.getItem('Token');
const userName=localStorage.getItem('UserName');

const urlParams = new URLSearchParams(window.location.search);

const socket = io("http://localhost:3000");
socket.on("connect", () => {
    console.log(`Connected to server with ID: ${socket.id}`);
});

const Group_Id = urlParams.get('groupId');
const Group_Name = urlParams.get('groupName');
const Invite_Token=urlParams.get('INVITE_TOKEN')|| null;

let lastMessageId;
let oldMessageId;
let isFetchingOlderMessages = false;


socket.on('Send-To-Room',message =>{
    console.log(message); 
    if(message.fileType){
        postingMessage(message.userName,message.Message,message.fileType);
    }else{
        postingMessage(message.userName,message.Message);
    }
})

sendButton.addEventListener('click', () => {
    postMessage();
});

chatInputBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        postMessage();
    }
});

function postMessage(){
    const messageContent = chatInputBar.value.trim();
    if (messageContent === '') return;
    const myobj={
        Message:chatInputBar.value,
        userName:userName,
        GROUP_ID:Group_Id
    }
    socket.emit('Room-Message',myobj);
    axios.post(`http://localhost:3000/Messages/postMessage`,myobj,{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
        postingMessage('NULL',chatInputBar.value);
        chatInputBar.value='';
    })
    .catch(err => {
        console.log(err);
    });
}

window.addEventListener("DOMContentLoaded",()=>{
    socket.emit('Room-Id',Group_Id);
    Title.textContent=Group_Name;
    console.log(Group_Id);
    axios.post(`http://localhost:3000/NewGroup/VerifyUser/${Group_Id}/${Invite_Token}`,{},{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
       localStorage.setItem(`Admin${Group_Id}`,response.data.Admin);
        if(response.data. message==='User belongs to the group'){
            console.log('User Belongs To Group');
        let messages=JSON.parse(localStorage.getItem(`Messages-${Group_Id}`))||[];
        lastMessageId=-1;
        if(messages.length!=0){
            messages.forEach(message => {
                if(message.fileType){
                    postingMessage(message.USER_NAME, message.MESSAGE_CONTENT,message.fileType);
                }else{
                    postingMessage(message.USER_NAME, message.MESSAGE_CONTENT);
                }
                lastMessageId=message.ID
                // postingMessage(message.USER_NAME, message.MESSAGE_CONTENT);
                // lastMessageId=message.ID
            });
            localStorage.setItem(`lastMessageId-${Group_Id}`,lastMessageId);
            localStorage.setItem(`oldMessageId-${Group_Id}`,messages[0].ID);
        }
                // setInterval(function(){ 
                    axios.get(`http://localhost:3000/Messages/getMessage/${lastMessageId}/${Group_Id}`,{headers:{'Authorization':Token}})
                    .then((response)=>{
                            response.data.Message.forEach(newMessage => {
                                if(newMessage.fileType){
                                    postingMessage(newMessage.USER_NAME, newMessage.MESSAGE_CONTENT,newMessage.fileType);
                                }else{
                                    postingMessage(newMessage.USER_NAME, newMessage.MESSAGE_CONTENT);
                                }
                                // lastMessageId=message.ID
                                // postingMessage(newMessage.USER_NAME,newMessage.MESSAGE_CONTENT);
                                messages.push(newMessage);
                                lastMessageId=newMessage.ID;
                                if (messages.length > 10) {
                                        messages.shift();
                                    }
                            });
                        localStorage.setItem(`lastMessageId-${Group_Id}`,lastMessageId);
                        localStorage.setItem(`Messages-${Group_Id}`, JSON.stringify(messages));
                        oldMessageId=Number(localStorage.getItem(`oldMessageId-${Group_Id}`));
                        console.log(oldMessageId);
                        if(!oldMessageId){
                            localStorage.setItem(`oldMessageId-${Group_Id}`,messages[0].ID);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            // },1000000)
        }else{
            console.log('User Doesnt belong to group');
        }
    })
    .catch(err => {
        console.log(err);
    });
  
})


function postingMessage(USER_NAME,message,fileType){
    console.log(message);
    const usernameSpan = document.createElement('span');
    usernameSpan.setAttribute('class', 'Username');
    let messageDiv
    const urlMessage=messageContainsUrl(message);
    console.log(urlMessage);
   console.log(fileType)
    if(fileType){
        if(fileType.startsWith('image')){
            messageDiv=document.createElement('img');
            messageDiv.src=message;
            messageDiv.setAttribute('class', 'imageSettings');
            const imgId=`img-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
            messageDiv.setAttribute('id',imgId);
            console.log(messageDiv);
            console.log("Image Source Set:", message);
            messageDiv.addEventListener('click', () => {
                const imageUrl = message; 
                window.open(imageUrl, '_blank');
            });
        }else if(fileType.startsWith('video')){
            messageDiv=document.createElement('video');
            messageDiv.src=message ;
            messageDiv.setAttribute('controls', '');
            messageDiv.setAttribute('class', 'imageSettings');
            console.log(messageDiv);
            console.log("Image Source Set:", message);
        }else if(fileType.endsWith('pdf') || fileType.endsWith('docx') ||  fileType.endsWith('doc') || fileType.endsWith('document')){
            messageDiv = document.createElement('a');
            messageDiv.setAttribute('class', 'Message-Text');
            messageDiv.href=message;
            messageDiv.textContent = message;
            messageDiv.target = "_blank"; // Open link in new tab
            messageDiv.style.color='blue';
            messageDiv.style.textDecoration='underline';
        }   
    }else if(urlMessage){
        messageDiv = document.createElement('a');
        messageDiv.setAttribute('class', 'Message-Text');
        messageDiv.href=message;
        messageDiv.textContent = message;
        messageDiv.target = "_blank"; // Open link in new tab
        messageDiv.style.color='blue';
        messageDiv.style.textDecoration='underline'; 
    }
    else{
        messageDiv = document.createElement('div');
        messageDiv.setAttribute('class', 'Message-Text');
        messageDiv.textContent = message;
    }
    const li=document.createElement('li');
    console.log(USER_NAME);
    // if(!message.startsWith("https://chatappfilestorage")){

    // }
        if(USER_NAME != 'NULL' && USER_NAME!=userName){
            li.setAttribute('class','Group-Message-Li');
            usernameSpan.textContent = USER_NAME;
        }else{
            li.setAttribute('class','Message-Li');
            usernameSpan.textContent = userName;
        }
    if(message.startsWith("https://chatappfilestorage")){
        li.appendChild(usernameSpan);
        li.appendChild(document.createElement('br'));
        li.appendChild(messageDiv);
    }else{
        li.appendChild(usernameSpan);
        li.appendChild(messageDiv);
    }
    chatUl.appendChild(li);
    chatUl.appendChild(document.createElement('br'));

}

function messageContainsUrl(message){
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return urlPattern.test(message);
}

function handleScroll() {
    if (chatBody.scrollTop === 0 && !isFetchingOlderMessages) {
        isFetchingOlderMessages = true;
        fetchOlderMessages();
    }
}

function fetchOlderMessages() {
    oldMessageId=Number(localStorage.getItem(`oldMessageId-${Group_Id}`));
    let oldScrollHeight = chatBody.scrollHeight;
    let messages = JSON.parse(localStorage.getItem(`Messages-${Group_Id}`)) || [];
    axios.get(`http://localhost:3000/Messages/getOlderMessages/${oldMessageId}/${Group_Id}`, { headers: { 'Authorization': Token } })
        .then(response => {
            console.log( response.data.Message);
            response.data.Message.forEach(newMessage => {
                // if (!messages.some(m => m.ID === newMessage.ID)) {
                    prependMessages(newMessage.USER_NAME, newMessage.MESSAGE_CONTENT,newMessage.fileType);
                    oldMessageId = newMessage.ID;
                // }
            });
            localStorage.setItem(`oldMessageId-${Group_Id}`, oldMessageId);
            chatBody.scrollTop = chatBody.scrollHeight - oldScrollHeight;

            isFetchingOlderMessages = false;
        })
        .catch(err => {
            console.error('Error fetching older messages:', err);
            isFetchingOlderMessages = false;
        });
}


chatBody.addEventListener('scroll', handleScroll);

function prependMessages(USER_NAME,message,fileType){
    console.log(message);
    const usernameSpan = document.createElement('span');
    usernameSpan.setAttribute('class', 'Username');
    let messageDiv
    const urlMessage=messageContainsUrl(message);
    console.log(urlMessage);
   console.log(fileType)
    if(fileType){
        if(fileType.startsWith('image')){
            messageDiv=document.createElement('img');
            messageDiv.src=message;
            messageDiv.setAttribute('class', 'imageSettings');
            const imgId=`img-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
            messageDiv.setAttribute('id',imgId);
            console.log(messageDiv);
            console.log("Image Source Set:", message);
            messageDiv.addEventListener('click', () => {
                const imageUrl = message; 
                window.open(imageUrl, '_blank');
            });
        }else if(fileType.startsWith('video')){
            messageDiv=document.createElement('video');
            messageDiv.src=message ;
            messageDiv.setAttribute('controls', '');
            messageDiv.setAttribute('class', 'imageSettings');
            console.log(messageDiv);
            console.log("Image Source Set:", message);
        }else if(fileType.endsWith('pdf') || fileType.endsWith('docx') ||  fileType.endsWith('doc') || fileType.endsWith('document')){
            messageDiv = document.createElement('a');
            messageDiv.setAttribute('class', 'Message-Text');
            messageDiv.href=message;
            messageDiv.textContent = message;
            messageDiv.target = "_blank"; // Open link in new tab
            messageDiv.style.color='blue';
            messageDiv.style.textDecoration='underline';
        }   
    }else if(urlMessage){
        messageDiv = document.createElement('a');
        messageDiv.setAttribute('class', 'Message-Text');
        messageDiv.href=message;
        messageDiv.textContent = message;
        messageDiv.target = "_blank"; // Open link in new tab
        messageDiv.style.color='blue';
        messageDiv.style.textDecoration='underline'; 
    }
    else{
        messageDiv = document.createElement('div');
        messageDiv.setAttribute('class', 'Message-Text');
        messageDiv.textContent = message;
    }
    const li=document.createElement('li');
    console.log(USER_NAME);
    // if(!message.startsWith("https://chatappfilestorage")){

    // }
        if(USER_NAME != 'NULL' && USER_NAME!=userName){
            li.setAttribute('class','Group-Message-Li');
            usernameSpan.textContent = USER_NAME;
        }else{
            li.setAttribute('class','Message-Li');
            usernameSpan.textContent = userName;
        }
    if(message.startsWith("https://chatappfilestorage")){
        li.appendChild(usernameSpan);
        li.appendChild(document.createElement('br'));
        li.appendChild(messageDiv);
    }else{
        li.appendChild(usernameSpan);
        li.appendChild(messageDiv);
    }
    chatUl.prepend(li);
    chatUl.prepend(document.createElement('br'));
}

InviteButton.addEventListener('click',function(){
    const atag=document.createElement('a');
    axios.get(`http://localhost:3000/NewGroup/generateToken/${Group_Id}`, { headers: { 'Authorization': Token } })
    .then((response)=>{
        console.log(response);
        const INVITE_TOKEN=response.data.INVITE_TOKEN;
        atag.href=`../Dynamic Page/DynamicPage.html?groupId=${Group_Id}&groupName=${encodeURIComponent(Group_Name)}&INVITE_TOKEN=${encodeURIComponent(INVITE_TOKEN)}`;
        atag.textContent = `http://127.0.0.1:5500/public/Dynamic Page/DynamicPage.html?groupId=${Group_Id}&groupName=${encodeURIComponent(Group_Name)}&INVITE_TOKEN=${encodeURIComponent(INVITE_TOKEN)}`;
        atag.target = '_blank';
        const span = document.querySelector('#linkDivSpan');
        span.appendChild(atag);
        document.querySelector('#Invite-Button').style.display='none';
        document.querySelector('#Chat-Body').style.filter='blur(5px)';
        document.querySelector('#Invite-Link-Div').style.display='block';

    })
    .catch(err => console.log(err))
});

function closeModal(){
    document.querySelector('#Invite-Link-Div').style.display='none';
    document.querySelector('#Chat-Body').style.filter='none';
    document.querySelector('#linkDivSpan').innerHTML='';
    document.querySelector('#Invite-Button').style.display='block';
    console.log(document.querySelector('#Invite-Button').style.display='block')
}

function showGroupMembers(){
    axios.get(`http://localhost:3000/NewGroup/GetGroupMembers/${Group_Id}`,{ headers: { 'Authorization': Token } })
        .then(response => {
            console.log(response);
            const Admin=JSON.parse(localStorage.getItem(`Admin${Group_Id}`));
            document.querySelector('.List-of-GroupMembers').style.display='block';
            document.querySelector('#groupMembersButton').style.display='none';
            const groupMembersDiv=document.querySelector('#innerDiv');
            for(let i=0;i<response.data.Data.length;i++){
                const div = document.createElement('div');
                div.setAttribute('class','Group-Members-Block');
                const nameText=document.createElement('span');
                nameText.setAttribute('class','groupMemberName');
                const input = document.createElement('input');
                input.type='hidden';
                input.value=response.data.Data[i].USER_ID;
                div.setAttribute('id',`div${input.value}`);
                div.appendChild(input);
                nameText.textContent = response.data.Data[i].GroupChatUserDetail.Name;
                div.appendChild(nameText);
                if(response.data.Data[i].ISADMIN){
                    const button=document.createElement('button');
                    button.setAttribute('class','Admin-Button');
                    button.setAttribute('id',`Admin${input.value}`);
                    button.textContent='Admin';
                    button.style.fontSize='15px';
                    div.appendChild(button);
                    const disButton=document.createElement('button');
                    disButton.setAttribute('class','Remove-Button');
                    disButton.setAttribute('id',`dismiss${input.value}`);
                    disButton.textContent='Dismiss as Admin';
                    div.appendChild(disButton);
                    disButton.addEventListener('click',function(){
                        const input = this.parentElement; 
                        const hidden = input.querySelector('input[type="hidden"]');
                        dismissAsAdmin(hidden.value);
                    });
                    const RemButton=document.createElement('button');
                        RemButton.setAttribute('class','Remove-Button');
                        RemButton.setAttribute('id',`remove${input.value}`);
                        RemButton.textContent='Remove';
                        RemButton.addEventListener('click',function(){
                            const input = this.parentElement; 
                            const hidden = input.querySelector('input[type="hidden"]');
                            removeFromGroup(hidden.value);
                        });
                        div.appendChild(RemButton);
                }else{
                    if(Admin == true){
                        const button=document.createElement('button');
                        button.setAttribute('class','Make-Admin-Button');
                        button.setAttribute('id',`Admin${input.value}`);
                        button.textContent='Make as Admin';
                        div.appendChild(button);
                        button.addEventListener('click',function(){
                            const input = this.parentElement; 
                            const hidden = input.querySelector('input[type="hidden"]');
                            makeAsAdmin(hidden.value);
                        });
                        const RemButton=document.createElement('button');
                        RemButton.setAttribute('class','Remove-Button');
                        RemButton.textContent='Remove';
                        RemButton.addEventListener('click',function(){
                            const input = this.parentElement; 
                            const hidden = input.querySelector('input[type="hidden"]');
                            removeFromGroup(hidden.value);
                        });
                        div.appendChild(RemButton);
                    }
                    
                    // button.addEventListener('click',function(){
                    //     const parentDiv=button.parentElement;
                    //     const name = parentDiv.querySelector('span').textContent;
                    //     console.log('The name is:', name);
                    //     AdminPower(name);
                    // })
                }
                groupMembersDiv.appendChild(div);
                console.log(groupMembersDiv);
                document.querySelector('#Chat-Body').style.width='950px';
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function closeGroupMembers(){
    // document.querySelector('.custom-info-button2').style.display='block';
    document.querySelector('#groupMembersButton').style.display='block';
    document.querySelector('.Chat-Body').style.filter='none'
    document.querySelector('#GroupMembersDiv').style.display='none';
    document.querySelector('#innerDiv').innerHTML='';
    document.querySelector('#Chat-Body').style.width='1280px';
}



document.querySelector('#searchBar').addEventListener('keydown',function(event){
    if (event.key === 'Enter') {
       const searchValue=document.querySelector('#searchBar').value;
       axios.post(`http://localhost:3000/NewGroup/getProfile/${searchValue}/${Group_Id}`,{},{headers:{'Authorization':Token}})
       .then(response=>{
            console.log(response);
            const ul=document.createElement('ul');
            const li = document.createElement('li');
            if(response.data.Details==='User Not Found'){
                li.textContent=response.data.Details;
            }else{
                const input=document.createElement('input');
                input.type='hidden';
                input.value=response.data.Details[0].ID;
                li.appendChild(input);
                const nameText = document.createTextNode(response.data.Details[0].Name);
                li.appendChild(nameText); 
                const Admin=JSON.parse(localStorage.getItem(`Admin${Group_Id}`));
                if(Admin==true && response.data.Member===false){
                    const button = document.createElement('button');
                    button.textContent='+Add'
                    button.setAttribute('class','Add-Group-Button');
                    button.addEventListener('click',function(){
                        const li = this.parentElement; 
                        const liText = li.querySelector('input[type="hidden"]');
                        addToGroup(liText.value);
                    })
                    li.append(button);
                }
            }
            ul.append(li);
            document.querySelector('#searchResults').appendChild(ul);
            document.querySelector('#searchResults').style.display='block';
       })
       .catch(err => {
        console.log(err);
       });
    }
})

document.addEventListener('click',function(){
    document.querySelector('#searchResults').innerHTML='';
    document.querySelector('#searchBar').value='';
    document.querySelector('#searchResults').style.display='none';
})

function addToGroup(value){
    axios.post(`http://localhost:3000/NewGroup/addToGroup/${value}/${Group_Id}`,{},{headers:{'Authorization':Token}})
       .then(response => console.log(response))
       .catch(err => console.log(err))
}

function makeAsAdmin(value){
    console.log('Button Clicked',value);
    axios.post(`http://localhost:3000/NewGroup/makeAsAdmin/${value}/${Group_Id}`,{},{headers:{'Authorization':Token}})
    .then(response => {
        console.log(response);
        const button = document.querySelector(`#Admin${value}`);
        button.textContent='Admin';
        button.setAttribute('class','Admin-Button');
        const disButton=document.createElement('button');
        disButton.setAttribute('class','Remove-Button');
        disButton.setAttribute('id',`dismiss${value}`);
        disButton.textContent='Dismiss as Admin';
        disButton.addEventListener('click',function(){
            dismissAsAdmin(value);
        });
        const div=document.querySelector(`#div${value}`);
        const removeButton=document.querySelector(`#remove${value}`);
        div.insertBefore(disButton,removeButton);
    })
    .catch(err => console.log(err))
}

function  removeFromGroup(value){
    console.log('button pressed');
    axios.delete(`http://localhost:3000/NewGroup/removeFromGroup/${value}/${Group_Id}`,{headers:{'Authorization':Token}})
       .then(response => {
            console.log(response);
            const div=document.querySelector(`#div${value}`);
            div.remove();
       })
       .catch(err => console.log(err))
}

function dismissAsAdmin(value){
    console.log('Button Pressed');
    axios.post(`http://localhost:3000/NewGroup/dismissAsAdmin/${value}/${Group_Id}`,{},{headers:{'Authorization':Token}})
    .then(response => {
         console.log(response);
        const Admin=document.querySelector(`#Admin${value}`);
        console.log(Admin);
        Admin.textContent='Make as Admin';
        Admin.setAttribute('class','Make-Admin-Button');
        Admin.addEventListener('click',function(){
            makeAsAdmin(value);
        });
        const button = document.querySelector(`#dismiss${value}`);
        button.remove();
    })
    .catch(err => console.log(err))
}

document.querySelector('#uploadButton').onclick = function() {
    console.log('Button clicked');
    document.querySelector('#fileInput').click(); 
};

document.querySelector('#fileInput').onchange = async function() {
    const selectedFile = this.files[0];

    if (!selectedFile) {
        alert("No file selected.");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    // const myobj={
    //     Message: formData,
    //     userName:userName,
    //     GROUP_ID:0
    // }
    // console.log(selectedFile);
    // console.log(formData);
    axios.post(`http://localhost:3000/Messages/postFiles/${userName}/${Group_Id}`,formData,{headers:{'Authorization':Token}})
    .then(response =>{
        console.log(response);
        const obj=response.data;
        socket.emit('Room-Message',obj);
        postingMessage('NULL',response.data.Message,response.data.fileType);
    })
    .catch(err => console.log(err))
}

