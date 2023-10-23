const form=document.getElementById("addForm");
const newitem=document.getElementById("items");
form.addEventListener("submit",additem);
newitem.addEventListener("click",removeitem);
const filter=document.getElementById('filter');
filter.addEventListener('keyup',filteritems);
function additem(e){
    e.preventDefault();
    const item=document.getElementById("item1").value;
    const item2=document.getElementById("item2").value;
    const li=document.createElement("li");
    li.className="list-group-item";
    li.appendChild(document.createTextNode(item));
    li.appendChild(document.createTextNode(" "+item2));
    newitem.appendChild(li)
    const deletebtn=document.createElement("button");
    deletebtn.className="btn btn-danger btn-sm float-right delete";
    deletebtn.appendChild(document.createTextNode("X"));
    li.appendChild(deletebtn);
    const editbtn=document.createElement("button");
    editbtn.className="btn btn-danger btn-sm float-right delete";
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
function filteritems(e){
    const text=e.target.value.toLowerCase();
    //console.log(text);
    const itemss=newitem.getElementsByTagName('li');
    //console.log(itemss);
    Array.from(itemss).forEach(function(item){
        const itemName=item.firstChild.textContent;
        const description=item.childNodes[1].textContent;
        //console.log(itemName);
        if(itemName.toLowerCase().indexOf(text) != -1 ||description.toLowerCase().indexOf(text)!= -1){
            item.style.display='block';
        }else{
            item.style.display='none';
        }
    });
}
















