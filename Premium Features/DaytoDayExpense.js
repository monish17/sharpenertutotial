const fieldSet=document.getElementById("expenseFieldset");
const dynamicData=document.getElementById("DynamicData");
const dynamicDataTable=document.getElementById("DynamicDataTable");

const stringifiedData=JSON.parse(localStorage.getItem("stringifiedData"));
const Token=localStorage.getItem('Token');

const month=["Janauary","february","march","April","May","June","July","August","September","October","November","December"]

window.addEventListener("DOMContentLoaded",()=>{
    const h5=document.createElement('h5');
    const currentDate = new Date();
    const dateString = `${currentDate.getDate()}/${month[currentDate.getMonth()]}/${currentDate.getFullYear()}`;
    const timeString = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    h5.textContent = `${dateString},  ${timeString}`;
    dynamicData.appendChild(h5);

    const h3=document.createElement('h3');
    h3.textContent=`${currentDate.getFullYear()}`;
    dynamicData.appendChild(h3);

    const h4=document.createElement('h4');
    h4.textContent=`${month[currentDate.getMonth()]}  ${currentDate.getFullYear()}`;
    dynamicData.appendChild(h4);
    console.log(stringifiedData);
    stringifiedData.forEach(entry => {
        const createdAtDate = new Date(entry.createdAt);
        const date = createdAtDate.getDate(); 
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();
        const formattedDate = `${date}/${month}/${year}`;
        entry.Date = formattedDate;
    });
    console.log(stringifiedData.length);
    let expense=0;
    let totalExpense=0;
   for(let i=0;i<stringifiedData.length;i++){                 
        const tr=document.createElement("tr");
        tr.bgColor="lightgrey";
        const th1=document.createElement('td');
        th1.textContent=`${stringifiedData[i].Date}`;
        tr.appendChild(th1);
        const th2=document.createElement('td');
        th2.textContent=`${stringifiedData[i].description}`;
        tr.appendChild(th2);
        const th3=document.createElement('td');
        th3.textContent=`${stringifiedData[i].category}`;
        tr.appendChild(th3);
        const th4=document.createElement('td');
        th4.textContent=" "
        tr.appendChild(th4);
        const th5=document.createElement('td');
        th5.textContent=`${stringifiedData[i].Expense_Amount}`;
        tr.appendChild(th5);
        totalExpense+=stringifiedData[i].Expense_Amount;
        dynamicDataTable.appendChild(tr);
        
    }
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.textContent=`Overall Expense = ${totalExpense}`;
    td.bgColor="lightgrey"
    tr.appendChild(td);
    dynamicDataTable.appendChild(tr);
    
})


function download(){
    axios.get('http://localhost:8000/premium/download', { headers: {"Authorization" : Token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}
