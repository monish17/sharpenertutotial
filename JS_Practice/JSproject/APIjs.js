const myform=document.querySelector('#myform');
const DishPrice=document.querySelector('#price');
const Dishitem=document.querySelector('#dish');
const msg=document.querySelector('.msg')
const ul=document.querySelector('#ul');
myform.addEventListener('submit',onSubmit);
function onSubmit(e){
    e.preventDefault();
    if (DishPrice.value===''||Dishitem.value===''){
        msg.style.color='red';
        msg.innerHTML='please enter all the fields';
        setTimeout(() =>msg.remove(),3000);
    }
    else{
        const li=document.createElement('li');
        const del=document.createElement('input');
        del.type='button';
        del.value='Delete Order';
        li.appendChild(document.createTextNode(`${DishPrice.value}-${Dishitem.value}`));
        const separator=document.createTextNode(' ');
        li.append(separator);
        li.appendChild(del);
        ul.appendChild(li);
        const myobj={
            Dish_price:DishPrice.value,
            Dish_Item:Dishitem.value,
        }
        updateTotalValue(DishPrice.value);
        axios.post("https://crudcrud.com/api/d795cf47418d46288cef50a59ee50666/userData",myobj)
        .then((Response)=>{
            console.log(Response);
            console.log('uploaded to the server')
        })
        .catch((err)=>{
            console.log(err);
            console.log('Error in the axios.post line code');
        })
        del.addEventListener('click',deleteClick);
        DishPrice.value=''
        Dishitem.value=''
    }
}
function getOrderIdByTableNo(TableNo) {
    return new Promise((resolve, reject) => {
        axios.get('https://crudcrud.com/api/d795cf47418d46288cef50a59ee50666/userData')
            .then((response) => {
                const OrderData = response.data.find(entry => entry.Dish_Item === TableNo);
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
        axios.delete(`https://crudcrud.com/api/d795cf47418d46288cef50a59ee50666/userData/${Order_id}`)
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
    const li = document.createElement('li');
    const del = document.createElement('input');
    del.type = 'button';
    del.value = 'Delete Product';
    li.appendChild(document.createTextNode(`${user.Dish_price}-${user.Dish_Item}`));
    const separator=document.createTextNode(' ');
    li.append(separator);
    li.appendChild(del);
    ul.appendChild(li);
    updateTotalValue(user.Dish_price);   
    del.addEventListener('click',deleteClick);
}
window.addEventListener("DOMContentLoaded",()=>{
    axios.get("https://crudcrud.com/api/d795cf47418d46288cef50a59ee50666/userData")
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
async function deleteClick(e) {
    const li = e.target.closest('li');
    if (li) {
        const liText = li.textContent;
        //console.log(li.textContent);
        const parts = liText.split('-');
        const price=parts[0].trim();
        const Product = parts[1].trim();
        
        try {
            const OrderId = await getOrderIdByTableNo(Product);

            if (OrderId) {
                const success = await deleteOrderDetails(OrderId);

                if (success) {
                    li.remove();
                    DeleteTotalValue(price);
                } else {
                    console.log('Problem in deleteUserDetails function');
                }
            } else {
                console.log('User ID not found for deletion');
            }
        } catch (error) {
            console.log(error);
            console.log('Error in deleteClick function');
        }
    }
}
function updateTotalValue(value) {
    const totalValueSpan = document.getElementById("totalValue");
    let currentTotal = parseFloat(totalValueSpan.textContent);
    const numericValue = parseFloat(value);
    totalValueSpan.textContent = currentTotal + numericValue;
}
function DeleteTotalValue(value) {
    const totalValueSpan = document.getElementById("totalValue");
    let currentTotal = parseFloat(totalValueSpan.textContent);
    const numericValue = parseFloat(value);
    totalValueSpan.textContent = currentTotal - numericValue;
}
