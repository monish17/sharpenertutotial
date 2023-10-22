/*console.log(document.domain);
console.log(document.URL);
console.log(document.title);
document.title= 'asdf';
console.log(document.doctype);
console.log(document.head);
console.log(document.body);
console.log(document.all);
console.log(document.all[10]);
//document.all[10].textContent='hello'
console.log(document.forms);
console.log(document.links);
console.log(document.getElementById("header-title"));
const ai=document.getElementById("header-title");
console.log(ai);
console.log(ai.textContent);
console.log(ai.innerText);
//ai.innerHTML= '<h3>hello1</h3>';
//ai.style.borderBottom="solid 3px #000"
const aoi=document.getElementById("main-header");
aoi.style.borderBottom="solid 3px #000"
const item=document.getElementsByClassName('title');
console.log(item[0]);
item[0].style.fontWeight='bold';
item[0].style.color='green';
const item1=document.getElementsByClassName("list-group-item")
console.log(item1)
console.log(item1[1])*/
/*item1[0].textContent= "hello";
item1[2].style.backgroundColor="green";
for (var i=0;i<item1.length;i++){
    item1[i].style.fontWeight="bold"
}
const item2=document.getElementsByClassName("list-group0");
console.log(item2)
item2[0].textContent="additional item";
item2[0].style.color="blue";
const item3=document.getElementsByTagName("li");
item3[4].style.backgroundColor="orange";*/
/*const items1=document.querySelector(".list-group-item:nth-child(2)");
items1.style.backgroundColor="green";
const items2=document.querySelector(".list-group-item:nth-child(3)");
items2.style.display="none";
const odd=document.querySelectorAll("li:nth-child(odd)");
for (var i=0;i<odd.length;i++){
    odd[i].style.backgroundColor="green";
}
const items3=document.querySelectorAll("li");
items3[1].style.color="green";*/
/*var itemsList = document.querySelector('#items');
console.log(itemsList.parentNode);
itemsList.parentElement.style.backgroundColor="#f4f4f4";
console.log(itemsList.parentNode.parentNode);
console.log(itemsList.parentNode.parentNode.parentNode);
console.log(itemsList.childNodes);
itemsList.children[1].style.backgroundColor="grey";
itemsList.firstElementChild.textContent="hello";
console.log(itemsList.firstChild);
console.log(itemsList.lastChild);
console.log(itemsList.nextSibling);
console.log(itemsList.previousSibling);
itemsList.lastElementChild.style.fontWeight="bold";
itemsList.previousElementSibling.style.backgroundColor="violet";
const newdiv=document.createElement("div");
//console.log(newdiv);*/
//solution
/*newdiv.className="hello";
newdiv.id="hi";
newdiv.setAttribute("title","hi there");
console.log(newdiv);
const newdivtext=document.createTextNode("hello");
newdiv.appendChild(newdivtext);
const container=document.querySelector('header .container');
const h1=document.querySelector('header h1');
container.insertBefore(newdiv,h1);
const newdiv2 = document.createElement("li");
newdiv2.className="list-group-item";
newdiv2.id="hi1";
newdiv2.setAttribute("title","hello");
const newdivtext2=document.createTextNode("hello");
newdiv2.appendChild(newdivtext2);
console.log(newdiv2);
const itemdiv=document.querySelector('div .list-group');
const it1=document.querySelector('div li');
itemdiv.insertBefore(newdiv2,it1);*/
const form=document.getElementById("addForm");
const newitem=document.getElementById("items");
form.addEventListener("submit",additem);
newitem.addEventListener("click",removeitem);

function additem(e){
    e.preventDefault();
    const item=document.getElementById("item").value;
    const li=document.createElement("li");
    li.className="list-group-item";
    li.appendChild(document.createTextNode(item));
    newitem.appendChild(li)
    const deletebtn=document.createElement("button");
    deletebtn.className="btn btn-danger btn-sm float-right delete";
    deletebtn.appendChild(document.createTextNode("X"));
    li.appendChild(deletebtn);
    const editbtn=document.createElement('button');
    editbtn.appendChild(document.createTextNode('edit'));
    li.appendChild(editbtn);

}
function removeitem(e){
    if (e.target.classList.contains('delete')){
        if(confirm('are you sure')){
            const li=e.target.parentElement;
            newitem.removeChild(li);
        }
    }
}















