console.log(document.domain);
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
ai.innerHTML= '<h3>hello</h3>';
//ai.style.borderBottom="solid 3px #000"
const aoi=document.getElementById("main-header");
aoi.style.borderBottom="solid 3px #000"
const item=document.getElementsByClassName('title');
console.log(item[0]);
item[0].style.fontWeight='bold';
item[0].style.color='green';
const item1=document.getElementsByClassName("list-group-item")
console.log(item1)
console.log(item1[1])
item1[0].textContent= "hello";
item1[2].style.backgroundColor="green";
for (var i=0;i<item1.length;i++){
    item1[i].style.fontWeight="bold"
}
const item2=document.getElementsByClassName("list-group0");
console.log(item2)
item2[0].textContent="additional item";
item2[0].style.color="blue";
const item3=document.getElementsByTagName("li");
item3[4].style.backgroundColor="orange";


