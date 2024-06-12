
const myform=document.querySelector('#form');
const expenseAmount=document.querySelector('#expenseAmount');
const description=document.querySelector('#description');
const category=document.querySelector('#category');
const ul=document.querySelector('#ul');
const header=document.querySelector('#header');
const premiumDiv=document.querySelector('#premiumDiv');
const downloadedFilesDiv=document.querySelector('#downloadedFilesDiv');
const Token=localStorage.getItem('Token');
const paginationDiv=document.querySelector("#paginationDiv");
const leaderBoardTable=document.querySelector('#Leaderboard-Table');
const downloadedFilesFieldset=document.querySelector('#downloadedFiles');
const rowsCategory=document.querySelector('#rowsCategory');
let page= localStorage.getItem('CurrentPage')|| 1 ;
rowsCategory.addEventListener('change', function(event) {
    DynamicPagination();
});
myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    const msg = document.createElement('div');
    myform.appendChild(msg);
    if (expenseAmount.value===''||description.value===''||category.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }else{
        const myobj={
            Expense_Amount:expenseAmount.value,
            description:description.value,
            category:category.value,
        }
        axios.post("http://44.223.35.27:8000/routes/postData",myobj,{headers:{'Authorization':Token}})
            .then((Response)=>{
                console.log('uploaded and arrived here');
                console.log(Response.data);
                const li=document.createElement('li');
                const hiddenId= document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.value=Response.data.expense.id;
                console.log(hiddenId);
                li.appendChild(hiddenId);
                li.appendChild(document.createTextNode(`${Response.data.expense.Expense_Amount} : ${Response.data.expense.description}:${Response.data.expense.category}`));
                const separator=document.createTextNode(' ');
                li.appendChild(separator);
                const del=document.createElement('input');
                del.type='button';
                del.value='Delete';
                li.appendChild(del);
                del.addEventListener('click',deleteclick);
                ul.insertBefore(li, ul.firstChild);
                if (ul.childNodes.length > 2) {
                    ul.removeChild(ul.lastChild); 
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        expenseAmount.value='';
        description.value='';
        category.value='';
    } 
}
window.addEventListener("DOMContentLoaded",()=>{
    //let page= localStorage.getItem('CurrentPage')|| 1 ;
    const decodedToken=parseJwt (Token);
    const pageLimit=localStorage.getItem('Page-Limit') || 2;
    //console.log(decodedToken);
    if(decodedToken.isPremiumUser){
        const button=document.getElementById('rzp-button');
        button.remove();
        premiumUser();
    }
    axios.get("http://44.223.35.27:8000/routes/retrieveData?page="+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            console.log(response.data.expense);
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                showNewUserOnScreen(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })
})

function deleteclick(e){
    const li = e.target.closest('li');
    if (li) {
        console.log(li);
        const hiddenId = li.querySelector('input[type="hidden"]');
        const hiddenIdValue = hiddenId.value;
        //console.log(hiddenIdValue);
        console.log(li.textContent);
        const expenseAmountValue = li.textContent.split(':')[0].trim();
        console.log(expenseAmountValue);
        axios.delete(`http://44.223.35.27:8000/routes/deleteData/${hiddenIdValue}`,{headers:{'Authorization':Token},data:{ expenseAmount: expenseAmountValue }})
            .then(response =>{
                console.log()
                if(response.data.message === true){
                    li.remove();
                    console.log("data deleted");
                }
                else{
                    console.log('error in removing the li tag');
                }
            })
            .catch(err => console.log("error happened in axios delete"));
    }
}

function showNewUserOnScreen(user) {
    const li=document.createElement('li');
    const hiddenId= document.createElement('input');
    hiddenId.type = 'hidden';
    hiddenId.value=user.id;
    console.log(hiddenId);
    li.appendChild(hiddenId);
    li.appendChild(document.createTextNode(`${user.Expense_Amount} :${user.description}: ${user.category}`));
    const separator=document.createTextNode(' ');
    li.appendChild(separator);
    const del=document.createElement('input');
    del.type='button';
    del.value='Delete';
    li.appendChild(del);
    ul.appendChild(li);
    del.addEventListener('click',deleteclick);
}

document.getElementById('rzp-button').onclick = async function(e){
    console.log('button is clicked');
    const response=await axios.get('http://44.223.35.27:8000/purchase/premiummembership',{headers:{'Authorization':Token}});
    //console.log(response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
            console.log(response);
            await axios.post('http://44.223.35.27:8000/purchase/updateTransactionStatus',{
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
            premiumUser();
        }
    };
    const rzpl=new Razorpay(options);
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed',function(response){
        console.log('response',response,"order id-",response.error.metadata.order_id);
        axios.post('http://44.223.35.27:8000/purchase/updateTransactionStatus',{
                order_id:response.error.metadata.order_id,
                payment_id:response.error.metadata.payment_id,
                Response:response
            },{headers:{'Authorization':Token}})
        alert('something went wrong');
    });
}

function premiumUser(){
    const h4 = document.createElement('h4');
    h4.appendChild(document.createTextNode('You are a Premium User'));
    header.appendChild(h4);
    
    const showLeaderButton = document.createElement('button');
    showLeaderButton.textContent = 'Show Leader Board'; 
    premiumDiv.prepend(showLeaderButton);
    showLeaderButton.addEventListener('click', function() {
        console.log("button is clicked");
        leaderBoardFunction();
        showLeaderButton.remove();
    });

    const downloadButton = document.createElement('button');
    downloadButton.textContent = "Download File";
    downloadButton.setAttribute('id', 'downloadButton'); // Set ID
    downloadButton.addEventListener('click', downloadFile); 
    premiumDiv.appendChild(downloadButton);
    premiumDiv.appendChild(document.createElement('br'));
    premiumDiv.appendChild(document.createElement('br'));
    axios.get("http://44.223.35.27:8000/Expense/getURL",{headers:{'Authorization':Token}})
        .then((response)=>{
            for(let i=0;i<response.data.FileNameArray.length;i++){
                downnloadedFiles(response.data.FileNameArray[i],response.data.URLArray[i]);
            }
        })
        .catch(err => console.log(err))
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function leaderBoardFunction(){
    console.log('clicked');

    axios.get('http://44.223.35.27:8000/premium/leadershipBoard',{headers:{'Authorization':Token}}).then((response)=>{
        console.log(response);
        console.log(response.data[0]);
        for(var i=0;i<response.data.length;i++){
            generateleaderBoard(response.data[i])
        }
    }).catch()
}
function generateleaderBoard(response){
    console.log(response);
    const li=document.createElement('li');
    li.style.listStyleType='none';
    //li.style.textAlign="justify";
    li.appendChild(document.createTextNode(`${response.Name}:   ${response.TotalExpense}`));
    leaderBoardTable.style.display='block';
    leaderBoardTable.appendChild(li);
    // premiumDiv.appendChild(document.createElement('br'));
}

// document.getElementById("expenseReport").onclick=async function(e){
//     console.log('button is clicked');
//     try{
//         const response=await axios.get('http://44.223.35.27:8000/Expense/ExpenseReport',{headers:{'Authorization':Token}});
//         // console.log(response);
//         // console.log(response.data.expense);
//         const stringifyedData=JSON.stringify(response.data.expense)
//         localStorage.setItem("stringifiedData",stringifyedData);
//         window.location.href="../Premium Features/DaytoDayExpense.html"
//     }catch(err){
//         console.log(err);
//     }
    
// }

function downloadFile(){
    console.log("button is working");
    axios.get('http://44.223.35.27:8000/routes/download', { headers: {"Authorization" : Token} })
    .then((response) => {
        console.log(response);
    if(response.status === 200){
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();
        const name=response.data.FileName;
        const link=response.data.fileUrl;
        downnloadedFiles(name,link);
    } else {
        throw new Error(response.data.message)
    }

    })
    .catch((err) => {
        console.log(err);
});
}


function downnloadedFiles(name,link){
    const a = document.createElement('a');
    a.textContent=name;
    a.href=link;
    downloadedFilesFieldset.appendChild(a);
    downloadedFilesFieldset.appendChild(document.createElement('br'));
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
    }
    const btn=document.createElement('button');
    btn.innerHTML=`${currentPage}`;
    btn.addEventListener('click', () => {
        getData(currentPage);
    });
    paginationDiv.appendChild(btn);
    if(hasNextPage){
        const btn=document.createElement('button');
        btn.innerHTML=`${nextPage}`;
        btn.addEventListener('click', () => {
            getData(nextPage);
        });
        paginationDiv.appendChild(btn);
        if(nextPage<lastPage){
            const btn=document.createElement('button');
            btn.innerHTML=`${lastPage}`;
            btn.addEventListener('click', () => {
                getData(lastPage);
            });
            paginationDiv.appendChild(btn);
        }
    }
}

function getData(page){
    console.log(`${page} button is clicked`);
    localStorage.setItem('CurrentPage',page);
    ul.innerHTML="";
    const pageLimit=localStorage.getItem('Page-Limit') || 2;
    axios.get("http://44.223.35.27:8000/routes/retrieveData?page="+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            console.log(response.data.expense);
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                showNewUserOnScreen(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })
}

function DynamicPagination(){
    console.log("function started",rowsCategory.value);
    localStorage.setItem('Page-Limit',rowsCategory.value);
    const pageLimit=rowsCategory.value;
    ul.innerHTML="";
    axios.get("http://44.223.35.27:8000/routes/retrieveData?page="+page+ "&pageLimit=" + pageLimit,{headers:{'Authorization':Token}})
        .then((response)=>{
            console.log(response);
            console.log(response.data.expense);
            pagination(response.data);
            for(var i=0;i<response.data.expense.length;i++){
                showNewUserOnScreen(response.data.expense[i])
            }
        })
        .catch((error)=>{
            console.log(error)
        })

}