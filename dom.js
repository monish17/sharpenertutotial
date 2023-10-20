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


