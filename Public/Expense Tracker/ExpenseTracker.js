
const balance= document.querySelector('#balance');
const incomeAmount=document.querySelector('#inc-amt');
const expenseAmount=document.querySelector('#exp-amt');
const form = document.querySelector('#form');
const description=document.querySelector('#desc');
const amount=document.querySelector('#amount');
const ul=document.querySelector('#trans');
const msg = document.querySelector('#err-message');
const Token=localStorage.getItem('Token');
const premiumDiv=document.querySelector('#PremiumDiv');
let selectedType='Income';
const rowsCategory=document.querySelector('#rowsCategory');
let page= localStorage.getItem('CurrentPage')|| 1 ;
const paginationDiv=document.querySelector('#paginationDiv');



document.getElementById('income').addEventListener('click', () => toggleSelection('Income'));
document.getElementById('expense').addEventListener('click', () => toggleSelection('Expense'));

function toggleSelection(type) {
    selectedType = type;
    if (type === 'Income') {
        document.getElementById('income').classList.add('active');
        document.getElementById('expense').classList.remove('active');
    } else {
        document.getElementById('income').classList.remove('active');
        document.getElementById('expense').classList.add('active');
    }
}

function showMessage(message) {
    msg.style.color = 'red';
    msg.innerHTML = message;
    setTimeout(() => 
        {msg.style.color='transparent'}, 3000);
}


form.addEventListener('submit',onSubmit)
function onSubmit(e){
    e.preventDefault();
   
        console.log(description.value , amount.value);
        const myobj = {
            type:selectedType,
            description:description.value,
            amount:amount.value
        };
        console.log(myobj);
        axios.post(`http://52.172.46.245/routes/PostData`,myobj,{headers:{'Authorization':Token}})
            .then((Response)=>{
                console.log('Data is posted');
                console.log(Response.data.expense);
                CreatingLiTag(Response.data.expense);
                //DynamicPagination();
                description.value="";
                amount.value="";
            }).catch((err)=>{
                console.log(err);
            })
}


window.addEventListener("DOMContentLoaded",()=>{
    const pageLimit=localStorage.getItem('Page-Limit') || 8;
    axios.get(`http://52.172.46.245/routes/retrieveData?page=`+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            //parseJwt function to find whether premium or not
            const decodedToken=parseJwt (Token);
            if(decodedToken.isPremiumUser){
                const button=document.getElementById('rzp-button');
                button.remove();
                premiumUser();
            }
            UpdateExpense();
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                CreatingLiTag(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })

})

function CreatingLiTag(data){
    const DataType=document.createElement('input');
    DataType.value=data.type;
    DataType.setAttribute('id','type')
    DataType.type='hidden';
    console.log(DataType);
    const li=document.createElement('li');
    if(DataType.value==='Income'){
        li.classList.add('inc');
    }else{
        li.classList.add('exp');
    }
    li.appendChild(DataType);
    const hiddenId= document.createElement('input');
    hiddenId.type = 'hidden';
    hiddenId.setAttribute('id','hidden-value');
    hiddenId.value=data.id;
    li.appendChild(hiddenId);
    li.appendChild(document.createTextNode(data.description));
    const span=document.createElement('span');
    span.textContent=`${data.Expense_Amount}`;
    li.appendChild(span);
    const btn=document.createElement('button');
    btn.textContent='X';
    btn.classList.add('btn-del');
    li.appendChild(btn);
    console.log(li);
    ul.prepend(li);
    btn.addEventListener('click',deleteclick);
    UpdateExpense();
    // DynamicPagination;
    const numberOfItems = ul.children.length;
    const pageLimit=localStorage.getItem('Page-Limit') || 2;
    if(numberOfItems>pageLimit){
        ul.removeChild(ul.lastElementChild);
    }

}

function deleteclick(e){
    const li = e.target.closest('li');
    if (li) {
        const DataType=li.querySelector('#type');
        const hiddenId = li.querySelector('#hidden-value');
        const hiddenIdValue = hiddenId.value;
        const span=li.querySelector('span');
        const spanTextContent=span.textContent;
        axios.delete(`http://52.172.46.245/routes/deleteData/${hiddenIdValue}`,{headers:{'Authorization':Token},data:{ expenseAmount: spanTextContent,type:DataType.value}})
            .then(response =>{
                console.log(response)
                if(response.data.message === true){
                    li.remove();
                    UpdateExpense();
                    DynamicPagination();
                }
                else{
                    console.log('error in removing the li tag');
                }
            })
            .catch(err => console.log("error happened in axios delete"));
    }
}

function UpdateExpense(){
    axios.get(`http://52.172.46.245/routes/getTotalTransaction`,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response.data);
            incomeAmount.textContent=`₹ ${response.data.TotalIncome}`;
            expenseAmount.textContent=`₹ ${response.data.TotalExpense}`;
            const Remaining=response.data.TotalIncome-response.data.TotalExpense;
            balance.textContent=`₹ ${Remaining}`;
        })
        .catch((error)=>{
            console.log(error)
        })

}

document.getElementById('rzp-button').onclick = async function(e){
    console.log('button is clicked');
    const response=await axios.get(`http://52.172.46.245/purchase/premiummembership`,{headers:{'Authorization':Token}});
    //console.log(response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
            console.log(response);
            await axios.post(`http://52.172.46.245/purchase/updateTransactionStatus`,{
                order_id:response.razorpay_order_id,
                payment_id:response.razorpay_payment_id,
                Response:response
            },{headers:{'Authorization':Token}}).then((res)=>{
                console.log(res);
                localStorage.setItem("Token",res.data.token);
            })
            alert('you are a Premium User Now')
            const button=document.getElementById('rzp-button');
            button.remove();
            document.getElementById('PremiumButton').remove()
            premiumUser();
        }
    };
    const rzpl=new Razorpay(options);
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed',function(response){
        console.log('response',response,"order id-",response.error.metadata.order_id);
        axios.post(`http://52.172.46.245/purchase/updateTransactionStatus`,{
                order_id:response.error.metadata.order_id,
                payment_id:response.error.metadata.payment_id,
                Response:response
            },{headers:{'Authorization':Token}})
        alert('something went wrong');
    });
}


function premiumUser(){
    console.log('premiumUserCalled');
    //fieldset
    const fieldset=document.createElement('fieldset');
    fieldset.style.height = '90px';
    fieldset.style.width = '100%';
    fieldset.style.padding = '20px'; 
    fieldset.style.border = '2px solid #000';
    fieldset.style.borderRadius = '10px'; 
    fieldset.style.margin = '0 auto'; 
    fieldset.style.backgroundColor="lightgreen"
    fieldset.setAttribute('id','PremiumFieldset'); 
    //LeaderBoard
    const showLeaderButton = document.createElement('button');
    showLeaderButton.textContent = 'Show Leader Board';
    showLeaderButton.style.backgroundColor = 'green';
    showLeaderButton.style.color = 'white';
    showLeaderButton.style.fontSize = '16px';
    showLeaderButton.style.padding = '10px 20px';
    showLeaderButton.style.border = '2px solid darkgreen';
    showLeaderButton.style.borderRadius = '5px';
    showLeaderButton.style.marginRight = '10px';
    //DownloadFile
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Expense Report';
    downloadButton.style.backgroundColor = 'green';
    downloadButton.style.color = 'white';
    downloadButton.style.fontSize = '16px'; 
    downloadButton.style.padding = '10px 20px';
    downloadButton.style.border = '2px solid darkgreen';
    downloadButton.style.borderRadius = '5px';
    //appending
    document.getElementById('UpperDiv').appendChild(fieldset);
    //document.getElementById('UpperDiv').appendChild(document.createElement('br'));
    //document.getElementById('UpperDiv').appendChild(document.createElement('br'));
    fieldset.appendChild(showLeaderButton);
    fieldset.appendChild(downloadButton);
    //Assigning function to buttons
    showLeaderButton.addEventListener('click', function() {
        console.log("ShowLeaderBoardButton is clicked");
        document.querySelector('.container').style.display='none';
        document.querySelector('#UpperDiv').style.display='none';
        document.querySelector('#UpperDiv').style.display='none';
        document.querySelector('#PremiumFieldset').style.display='none';
        document.body.style.backgroundColor="white";
       leaderBoardFunction();
    });
    downloadButton.addEventListener('click',function(){
        console.log('DownloadFiles Button clicked');
        document.querySelector('#PremiumFieldset').style.display='none';
        document.body.style.backgroundColor='white';
        const container=document.querySelector('.container');
        container.style.filter='blur(5px)';
        const hiddenDiv = document.querySelector('#model');
        hiddenDiv.style.display='block';
        downloadReport()
    });
}

function leaderBoardFunction(){
    console.log('clicked');
    premiumDiv.style.backgroundColor='#eaeaea';
    premiumDiv.style.color='#333333';
    const deletebutton=document.createElement('button');
    deletebutton.textContent='X';
    deletebutton.setAttribute('id','PremiumDivButton');
    const h2=document.createElement('h2');
    h2.textContent='LeaderBoard of All the Users';
    h2.style.position='relative';
    h2.style.top='80px';
    const ContentDiv=document.createElement('div');
    ContentDiv.style.position='relative';
    ContentDiv.style.top='120px';
    ContentDiv.setAttribute('id','contentDiv');
    //appending
    premiumDiv.appendChild(deletebutton);
    premiumDiv.appendChild(h2);
    premiumDiv.appendChild(ContentDiv);
   

    axios.get(`http://52.172.46.245/premium/leadershipBoard`,{headers:{'Authorization':Token}}).then((response)=>{
        for(var i=0;i<response.data.length;i++){
            generateleaderBoard(response.data[i])
        }
    }).catch()
}

function generateleaderBoard(response){
    const li=document.createElement('li');
    li.style.listStyleType='none';
    li.style.whiteSpace="pre";
    li.appendChild(document.createTextNode(`Name: ${response.Name}       TotalExpenses: ${response.TotalExpense}`));
    const container=document.createElement('fieldset');
    container.style.width='300px';
    //container.style.maxHeight = '150px'; 
    container.style.padding = '10px';
    container.style.color="#721c24";
    container.style.backgroundColor="#f0f0f0";
    container.style.fontSize="16px";
    container.style.left='129px';
    container.style.position='relative';
    container.style.border = '5px dashed #8a8a8a';
    container.appendChild(li);
    document.querySelector('#contentDiv').appendChild(container);
    premiumDiv.style.display='block';
    document.querySelector('#PremiumDivButton').addEventListener('click',function(){
        premiumDiv.innerHTML='';
        premiumDiv.style.display='none';
        document.querySelector('#PremiumFieldset').style.display='block';
        document.querySelector('.container').style.display='flex';
        document.querySelector('#UpperDiv').style.display='block';
        document.body.style.backgroundColor='#9ea9ad';

    })

}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function downloadFile(){
    console.log("button is working");
    axios.get(`http://52.172.46.245/routes/download`, { headers: {"Authorization" : Token} })
    .then((response) => {
        console.log(response);
    if(response.status === 200){
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        // a.textContent=response.data.fileName;
        a.download = 'myexpense.csv';
        a.click();
        // document.querySelector('#DownloadReportUl').appendChild(a);

    } else {
        throw new Error(response.data.message)
    }

    })
    .catch((err) => {
        console.log(err);
});
}

function downloadReport(){
    const ReportButton=document.createElement('button');
    ReportButton.textContent='X';
    ReportButton.setAttribute('id','ReportButton');
    const h2=document.createElement('h2');
    h2.style.position='relative';
    h2.style.top='100px';
    h2.textContent='Expense Report';
    document.querySelector('#model-content').appendChild(ReportButton);
    document.querySelector('#model-content').appendChild(h2);
    axios.get(`http://52.172.46.245/routes/retrieveExpenseReport`,{headers:{'Authorization':Token}})
        .then((response)=>{
            creatingTable(response.data.Data);
            const DownloadedFilesHistory=document.createElement('button');
            const downloadButton=document.createElement('button');
             //css styling
            DownloadedFilesHistory.textContent='Previous Downloads Details'
            DownloadedFilesHistory.style.fontSize='15px';
            DownloadedFilesHistory.style.height='60px';
            DownloadedFilesHistory.style.width='150px';
            // DownloadedFilesHistory.style.position = 'absolute';
            DownloadedFilesHistory.style.left='55px';
            const tableHeight=document.querySelector('#ExpenseTable').offsetHeight;
            DownloadedFilesHistory.style.marginTop='200px';
            //DownloadedFilesHistory.style.top='400px';
            DownloadedFilesHistory.style.borderRadius='10px';   
            DownloadedFilesHistory.style.color='white';
            DownloadedFilesHistory.style.backgroundColor='black';
            DownloadedFilesHistory.setAttribute('id','FileHistoryButton');
            downloadButton.textContent=' ↓ '
            downloadButton.style.fontSize='30px';
            downloadButton.style.height='50px';
            downloadButton.style.width='50px';
            downloadButton.style.borderRadius='50%';
            // downloadButton.style.position = 'absolute';
            downloadButton.style.marginTop='250px';
            downloadButton.style.left='90%';
            downloadButton.style.color='white';
            downloadButton.style.backgroundColor='black';
            downloadButton.style.bottom='5%';
            downloadButton.setAttribute('id','DownArrowButton');

            //Appending
            document.querySelector('#model-content').appendChild(DownloadedFilesHistory);
            document.querySelector('#model-content').appendChild(downloadButton);
            //Adding EventListeners
            downloadButton.addEventListener('click',function(){
                downloadFile();

            })
            DownloadedFilesHistory.addEventListener('click',function(){
                downloadReportHistory();
            });
            document.querySelector('#ReportButton').addEventListener('click',function(){
                document.querySelector('#ExpenseTable').remove();
                document.querySelector('#model').style.display='none';
                document.querySelector('#model-content').innerHTML='';
                document.querySelector('.container').style.display='flex';
                document.querySelector('.container').style.filter='none';
                document.querySelector('#PremiumFieldset').style.display='block';
                document.body.style.backgroundColor='#9ea9ad';
            })
        })
        .catch((error)=>{
            console.log(error)
        })
}

function creatingTable(data){
    const table = document.createElement('table');
    table.border = "1"; 

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [ 'Date','Description', 'Expense','Income'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        const date = new Date(item.createdAt).toLocaleDateString(); // Format the date
        dateCell.textContent = date;
        row.appendChild(dateCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = item.description;
        row.appendChild(descriptionCell);
        
        if(item.type==='Expense'){
            const Expense = document.createElement('td');
            Expense.textContent =item.Expense_Amount;
            row.appendChild(Expense);

            const Income = document.createElement('td');
            Income.textContent =' '
            row.appendChild(Income);
        }else{
            const Expense = document.createElement('td');
            Expense.textContent =' ';
            row.appendChild(Expense);

            const Income = document.createElement('td');
            Income.textContent =item.Expense_Amount;
            row.appendChild(Income);
        }
        tbody.appendChild(row);
    });
    const rows = document.createElement('tr');
        for(let i=0;i<4;i++){
            const Content = document.createElement('td');
            if(i==2){
                Content.textContent=expenseAmount.textContent;
            }else if(i==3){
                Content.textContent=incomeAmount.textContent;
            }else{
                Content.textContent = '';
            }
            rows.appendChild(Content);
    }
    table.appendChild(tbody);
    table.appendChild(rows);

    // Get the table container div
    const tableContainer = document.querySelector('#model-content');
    // Append the table to the container
    tableContainer.appendChild(table);
    table.style.position='relative';
    table.style.margin='0 auto';
    table.style.top='120px';
    table.style.width='700px';
    table.setAttribute('id','ExpenseTable');
}

function downloadReportHistory(){
    console.log('DownloadReport function Arrived>>>>>>>>>>');
    axios.get(`http://52.172.46.245/routes/DownloadsHistory`,{headers:{'Authorization':Token}})
    .then((response)=>{
        console.log(response);
        document.getElementById('FileHistoryButton').remove();
        const ul=document.createElement('ul');
        const fileNames=response.data.FileNameArray
        const Urls=response.data.URLArray
        const h4=document.createElement('h4');
        h4.textContent="Previously Downloaded Reports"
        ul.appendChild(h4);
        for(let i=0;i<Urls.length;i++){
            const li=document.createElement('li');
            const a = document.createElement('a');
            a.textContent=`${fileNames[i]}`;
            a.href=Urls[i];
            li.appendChild(a);
            li.style.listStyleType='square';
            ul.appendChild(li);
            // ul.appendChild(document.createElement('br'));
        } 
        ul.style.position = 'absolute';
        ul.style.left='70px';
        ul.setAttribute('id','DownloadReportsUl');
        const tableHeight=document.querySelector('#ExpenseTable').offsetHeight;
        ul.style.marginTop=tableHeight+'px';
        document.querySelector('#model-content').appendChild(ul);    
    })
    .catch()
}

//pagination
rowsCategory.addEventListener('change', function(event) {
    DynamicPagination();
});

function DynamicPagination(){
    console.log("function started",rowsCategory.value);
    localStorage.setItem('Page-Limit',rowsCategory.value);
    const pageLimit=rowsCategory.value;
    ul.innerHTML="";
    axios.get(`http://52.172.46.245/routes/retrieveData?page=`+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            console.log(response.data.expense);
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                CreatingLiTag(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })

}

function pagination(data){
    paginationDiv.innerHTML="";
    const hasPreviousPage=data.hasPreviousPage;
    const hasNextPage=data.hasNextPage;
    const nextPage=data.nextPage;
    const currentPage=data.currentPage;
    const lastPage=data.lastPage;
    if(hasPreviousPage){
        const btn=document.createElement('button');
        btn.innerHTML=`${hasPreviousPage}`;
        btn.addEventListener('click', () => {
            getData(hasPreviousPage);
        });
        paginationDiv.appendChild(btn);
        btn.setAttribute('class','paginationButton');
    }
    const btn=document.createElement('button');
    btn.innerHTML=`${currentPage}`;
    btn.addEventListener('click', () => {
        getData(currentPage);
    });
    paginationDiv.appendChild(btn);
    btn.setAttribute('class','paginationButton');
    if(hasNextPage){
        const btn=document.createElement('button');
        btn.innerHTML=`${nextPage}`;
        btn.addEventListener('click', () => {
            getData(nextPage);
        });
        paginationDiv.appendChild(btn);
        btn.setAttribute('class','paginationButton');
        if(nextPage<lastPage){
            const btn=document.createElement('button');
            btn.innerHTML=`${lastPage}`;
            btn.addEventListener('click', () => {
                getData(lastPage);
            });
            paginationDiv.appendChild(btn);
            btn.setAttribute('class','paginationButton');
        }
    }
}

function getData(page){
    console.log(`${page} button is clicked`);
    localStorage.setItem('CurrentPage',page);
    const pageLimit=localStorage.getItem('Page-Limit') || 2;
    ul.innerHTML="";
    axios.get(`http://52.172.46.245/routes/retrieveData?page=`+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            console.log(response.data.expense);
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                CreatingLiTag(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })
}

