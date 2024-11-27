// import{ io } from "socket.io-client" 
//const { default: Message } = require("tedious/lib/message"); <-- useful while using MS SQL server
const chatBody=document.querySelector('#Chat-Body');
const chatUl=document.querySelector('#Chat-Ul')
const chatInputBar=document.querySelector('#Message-InputBar');
const sendButton=document.querySelector('#Message-Button');
const GroupNameDiv=document.querySelector('#listOfGroups');
const Token=localStorage.getItem('Token');
const userName=localStorage.getItem('UserName');

// const socket=io("http://localhost:3000")

socket.on("connect", () => {
    console.log(`Connected to server with ID: ${socket.id}`);
});

socket.on('receive-message',message =>{
    console.log(message);
    if(message.fileType){
        postingMessage(message.userName,message.Message,message.fileType);
    }else{
        postingMessage(message.userName,message.Message);
    }
})

let lastMessageId;
let oldMessageId;
let isFetchingOlderMessages = false;
let Group_Id=0


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
        GROUP_ID:0
    }
    socket.emit('Send-event',myobj);
    axios.post(`http://localhost:3000/Messages/postMessage`,myobj,{headers:{'Authorization':Token}})
    .then((response)=>{
        // console.log(response);
        postingMessage('NULL',chatInputBar.value);
        chatInputBar.value='';
    })
    .catch(err => {
        console.log(err);
    });
}

window.addEventListener("DOMContentLoaded",()=>{
    console.log('Windows listener');
    Group_Id=0;
    let messages= JSON.parse(localStorage.getItem('Messages'))||[];
    lastMessageId=-1;
    if(messages.length!=0){
        messages.forEach(message => {
            if(message.fileType){
                postingMessage(message.USER_NAME, message.MESSAGE_CONTENT,message.fileType,message.fileName);
            }else{
                postingMessage(message.USER_NAME, message.MESSAGE_CONTENT);
            }
            lastMessageId=message.ID
        });
        localStorage.setItem('lastMessageId',lastMessageId);
        localStorage.setItem('oldMessageId',messages[0].ID);
    }
                axios.get(`http://localhost:3000/Messages/getMessage/${lastMessageId}/${Group_Id}`,{headers:{'Authorization':Token}})
                .then((response)=>{
                        console.log(response);
                        response.data.Message.forEach(newMessage => {
                            console.log(newMessage);
                            // newMessage.fileType
                            console.log(newMessage.fileName);
                            if(newMessage.fileType){
                                postingMessage(newMessage.USER_NAME,newMessage.MESSAGE_CONTENT,newMessage.fileType,newMessage.fileName);
                            }else{
                                postingMessage(newMessage.USER_NAME,newMessage.MESSAGE_CONTENT);
                            }
                            messages.push(newMessage);
                            lastMessageId=newMessage.ID;
                            console.log(lastMessageId);
                            if (messages.length > 10) {
                                    messages.shift();
                                }
                        });
                    localStorage.setItem('lastMessageId',lastMessageId);
                    oldMessageId=Number(localStorage.getItem('oldMessageId'));
                    console.log(oldMessageId);
                    if(!oldMessageId){
                        localStorage.setItem('oldMessageId',messages[0].ID);
                    }
                 // localStorage.setItem('oldMessageId',messages[0].ID);
                    localStorage.setItem('Messages', JSON.stringify(messages));
                })
                .catch(err => {
                    console.log(err);
                });
        axios.get(`http://localhost:3000/NewGroup/ListOfGroups`, { headers: { 'Authorization': Token } })
        .then((response)=>{
           const data=response.data.ListOfGroupIds;
           data.forEach(messages=>{
            const hiddenValue=document.createElement('input');
            hiddenValue.setAttribute('class','groupName');
            hiddenValue.type='hidden';
            hiddenValue.value=messages.GROUP_ID
            const tagName=messages.CustomGroup.NAME;
            const div = document.createElement('div');
            div.textContent=tagName;
            div.appendChild(hiddenValue);
            console.log(div);
            div.addEventListener('click', function() {
                console.log('Button Clicked');
                socket.emit('Room-Joining',hiddenValue.value);
                window.location.href=`../Dynamic Page/DynamicPage.html?groupId=${hiddenValue.value}&groupName=${encodeURIComponent(tagName)}`;
            });
            div.setAttribute('class','GroupListDiv');
            GroupNameDiv.appendChild(div);
           });   
        })
        .catch(err =>{
            console.log(err);
        })
        axios.get(`http://localhost:3000/NewGroup/GetGroupMembers/${Group_Id}`,{ headers: { 'Authorization': Token } })
        .then(response => {
            const groupMembersDiv=document.querySelector('#GroupMembersDiv');
            for(let i=0;i<response.data.Data.length;i++){
                const div = document.createElement('div');
                div.setAttribute('class','Group-Members-Block');
                const nameText=document.createElement('span');
                nameText.setAttribute('class','groupMemberName');
                nameText.textContent = response.data.Data[i].Name;
                div.appendChild(nameText);
                groupMembersDiv.appendChild(div);
            }
        })
        .catch(err => {
            console.log(err);
        });
})


function postingMessage(USER_NAME,message,fileType,fileName){
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
            messageDiv.textContent = fileName;
            messageDiv.target = "_blank"; // Open link in new tab
            messageDiv.style.color='blue';
            messageDiv.style.textDecoration='underline';
            console.log(messageDiv);
        }   
    }else if(urlMessage){
        messageDiv = document.createElement('a');
        messageDiv.setAttribute('class', 'Message-Text');
        messageDiv.href=message;
        messageDiv.textContent = 'Group-Invite-Link';
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
    if(message.startsWith("https://chatappfilestorage")||urlMessage){
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
    oldMessageId=Number(localStorage.getItem('oldMessageId'));
    console.log(oldMessageId);
    let oldScrollHeight = chatBody.scrollHeight;
    let messages = JSON.parse(localStorage.getItem('Messages')) || [];
    axios.get(`http://localhost:3000/Messages/getOlderMessages/${oldMessageId}/${Group_Id}`, { headers: { 'Authorization': Token } })
        .then(response => {
            console.log( response.data.Message);
            if(response.data.Message.length === 0){
                axios.get(`http://localhost:3000/Messages/getArchievedMessages/${oldMessageId}/${Group_Id}`, { headers: { 'Authorization': Token } })
                .then(response =>{
                    console.log(response);
                    response.data.Message.forEach(newMessage => {
                        // if (!messages.some(m => m.ID === newMessage.ID)) {
                            prependMessages(newMessage.USER_NAME, newMessage.MESSAGE_CONTENT,newMessage.fileType,newMessage.fileName);
                            oldMessageId = newMessage.ID;
                        // }
                    });
                    localStorage.setItem('oldMessageId', oldMessageId);
                    chatBody.scrollTop = chatBody.scrollHeight - oldScrollHeight;

                    isFetchingOlderMessages = false;
                })
                .catch(err =>{
                    console.log('Error in fetching data from ArchievedMessages');
                    isFetchingOlderMessages = false;
                })
            }else{
                response.data.Message.forEach(newMessage => {
                    // if (!messages.some(m => m.ID === newMessage.ID)) {
                        prependMessages(newMessage.USER_NAME, newMessage.MESSAGE_CONTENT,newMessage.fileType,newMessage.fileName);
                        oldMessageId = newMessage.ID;
                    // }
                });
                localStorage.setItem('oldMessageId', oldMessageId);
                chatBody.scrollTop = chatBody.scrollHeight - oldScrollHeight;

                isFetchingOlderMessages = false;
            }
        })
        .catch(err => {
            console.error('Error fetching older messages:', err);
            isFetchingOlderMessages = false;
        });
}


chatBody.addEventListener('scroll', handleScroll);

function prependMessages(USER_NAME,message,fileType,fileName){
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
            messageDiv.textContent = fileName;
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


function openModal(){
    document.getElementsByClassName('Create-Group')[0].style.display='block';
    document.getElementsByClassName('Group-Create-Button')[0].style.display='none';
    document.querySelector('.Chat-Body').style.filter='blur(5px)'
   
}

function closeModal(){
    document.getElementsByClassName('Create-Group')[0].style.display='none';
    document.getElementsByClassName('Group-Create-Button')[0].style.display='block';
    document.querySelector('.Chat-Body').style.filter='none'

}

function postGroupData(){
    const groupName=document.getElementById('groupName').value;
    myobj={
        GroupName:groupName
    }
    console.log(groupName);
    axios.post(`http://localhost:3000/NewGroup/CreateGroup`,myobj, { headers: { 'Authorization': Token } })
        .then(response => {
            if(response.data.message==='Group-Created'){
                console.log(response);
                const groupId=response.data.GROUP_ID;
                window.location.href=`../Dynamic Page/DynamicPage.html?groupId=${groupId}&groupName=${encodeURIComponent(groupName)}`;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function showGroups(){
    document.querySelector('.custom-info-button').style.display='none';
    document.querySelector('#Chat-Body').style.width='880px';
    document.querySelector('.List-of-Groups').style.display='block';
}

function closeGroupList(){
    document.querySelector('.custom-info-button').style.display='block';
    document.querySelector('#Chat-Body').style.width='1270px';
    document.querySelector('.List-of-Groups').style.display='none';
}

function closeGroupMembers(){
    document.querySelector('.custom-info-button2').style.display='block';
    // document.querySelector('.Chat-Body').style.filter='none'
    document.querySelector('#GroupMembersDiv').style.display='none';
    document.querySelector('#Chat-Body').style.width='1250px';
}


function showGroupMembers(){
    document.querySelector('.custom-info-button2').style.display='none';
    // document.querySelector('.Chat-Body').style.filter='blur(5px)'
    document.querySelector('#GroupMembersDiv').style.display='block';
    document.querySelector('#Chat-Body').style.width='880px';
}

function makeAsAdmin(){
    console.log('Button Clicked');
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
        socket.emit('Send-event',obj);
        postingMessage('NULL',response.data.Message,response.data.fileType,response.data.fileName);
    })
    .catch(err => console.log(err))
}

