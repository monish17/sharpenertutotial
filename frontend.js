const myform=document.querySelector('#myForm');
const postLink=document.querySelector('#post');
const postDescription=document.querySelector("#description");
const dynamicFieldset = document.querySelector('#dynamicFieldset');

myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    console.log(postLink.value,postDescription.value);
    const myobj={
        postLink:postLink.value,
        postDescription:postDescription.value
    }
    console.log(myobj);
    axios.post("http://localhost:8000/post-data",myobj)
        .then((Response)=>{
                console.log(Response);
                console.log(postLink.value);
                const imgElement = document.createElement('img');
                imgElement.src = postLink.value;
                imgdescription=postDescription.value
                const textnode=document.createTextNode(imgdescription);
                const newdiv=document.createElement('div');
                newdiv.appendChild(imgElement);
                newdiv.appendChild(document.createElement('br'));
                newdiv.appendChild(textnode);
                newdiv.appendChild(document.createElement('br'));
                const buttonElement = document.createElement('button');
                buttonElement.type = 'button'; 
                buttonElement.textContent = 'Add Comment';
                buttonElement.style.backgroundColor = 'transparent';
                buttonElement.style.border = 'none';
                buttonElement.style.color = 'blue';
                buttonElement.style.textDecoration = 'underline';
                buttonElement.style.cursor = 'pointer';
                newdiv.appendChild(buttonElement);
                newdiv.appendChild(document.createElement('br'));
                const ul=document.createElement('ul');
                ul.setAttribute('id',Response.data.createPost.id);
                console.log(ul.id);
                dynamicFieldset.appendChild(newdiv);
                buttonElement.addEventListener('click', function() {
                    addcomment(ul.id);
                });
        })
        .catch((err)=>{
            console.log(err);
        })
}
function addcomment(ulId) {
    const inputElement=document.createElement('input');
    inputElement.type='input';
    const ul = document.getElementById(ulId);
    if (ul) {
        const li = document.createElement('li');
        li.appendChild(inputElement);
        ul.appendChild(li);
    } else {
        console.error('UL element with id ' + ulId + ' not found.');
    }
}