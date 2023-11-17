const myform=document.querySelector('#myform');
const DishPrice=document.querySelector('#price');
const Dishitem=document.querySelector('#dish');
const table=document.querySelector('#table');
const msg=document.querySelector('.msg')
myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    const selectedTableId = table.value;
    const selectedTable = document.getElementById(selectedTableId);
    if (DishPrice.value===''||Dishitem.value===''||table.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }
    else{
        const li=document.createElement('li');
        const del=document.createElement('input');
        del.type='button';
        del.value='Delete Order';
        li.appendChild(document.createTextNode(`${DishPrice.value}-${table.value}-${Dishitem.value}`));
        const separator=document.createTextNode(' ');
        li.append(separator);
        li.appendChild(del);
        selectedTable.appendChild(li);
        const myobj={
            Dish_price:DishPrice.value,
            Table:table.value,
            Dish_Item:Dishitem.value,
        }
        axios.post("https://crudcrud.com/api/8132d5b330974d3eaa32a173a31b581f/userData",myobj)
        .then((Response)=>{
            console.log(Response);
            console.log('uploaded to the server')
        })
        .catch((err)=>{
            console.log(err);
            console.log('Error in the axios.post line code');
        })
        del.addEventListener('click',deleteclick);
        DishPrice.value=''
        Dishitem.value=''
        table.value=''
    }
}
function getOrderIdByTableNo(TableNo) {
    return new Promise((resolve, reject) => {
        axios.get('https://crudcrud.com/api/8132d5b330974d3eaa32a173a31b581f/userData')
            .then((response) => {
                const OrderData = response.data.find(entry => entry.Table === TableNo);
                // console.log('orderdata._id');
                // console.log(OrderData._id);
                resolve(OrderData ? OrderData._id : null);
            })
            .catch((error) => {
                console.log(error);
                console.log('Error getting user data for deleting or updating');
                reject(null);
            });
    });
}
function deleteOrderDetails(Order_id) {
    return new Promise((resolve, reject) => {
        axios.delete(`https://crudcrud.com/api/8132d5b330974d3eaa32a173a31b581f/userData/${Order_id}`)
            .then((response) => {
                console.log(response);
                console.log('UserDetails deleted from server');
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
                console.log('error deleting the user details');
                console.log('False');
                reject(false);
            });
    });
}
function showOrderDetailsOnScreen(user) {
    const selectedTableId = user.Table;
    const selectedTable = document.getElementById(selectedTableId)
    const li = document.createElement('li');
    const del = document.createElement('input');
    del.type = 'button';
    del.value = 'Delete Order';
    li.appendChild(document.createTextNode(`${user.Dish_price}-${user.Table}-${user.Dish_Item}`));
    const separator=document.createTextNode(' ');
    li.append(separator);
    li.appendChild(del);
    selectedTable.appendChild(li);    
    del.addEventListener('click',deleteclick);
}
window.addEventListener("DOMContentLoaded",()=>{
    axios.get("https://crudcrud.com/api/8132d5b330974d3eaa32a173a31b581f/userData")
        .then((response)=>{
            console.log(response)
            for(var i=0;i<response.data.length;i++){
                showOrderDetailsOnScreen(response.data[i])
            }
        })
        .catch((error)=>{
            console.log(error)
            console.log('Error Retriving Data from Server')
        })
})
function deleteclick(e){
    const li = e.target.closest('li');
    if (li) {
        const liText=li.textContent;
        console.log(li.textContent);
        const parts = liText.split('-');
        const Table = parts[1];
        // console.log('table');
        console.log(Table);
        getOrderIdByTableNo(Table)
            .then((OrderId) => {
                // console.log(Table);
                // console.log('orderId');
                // console.log(OrderId);
                if (OrderId) {
                    deleteOrderDetails(OrderId)
                        .then((success) => {
                            if (success) {
                                li.remove();
                            } else {
                                console.log('Problem in deleteUserDetails function');
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log('problem in the deleteUserDetails function')
                        });
                } else {
                    console.log('User ID not found for deletion');
                }
            })
            .catch((error) => {
                console.log(error);
                console.log('error in getUserDetailsByEmail function');
            });

    }
}