console.log('person1: shows Ticket');
console.log('person2: shows Ticket');
const asi=async()=>{
    const wifebringingTickets=new Promise((resolve,reject)=>reject('ticket'));
    const popcorn=new Promise((resolve,reject)=>resolve('popcorns'));
    const butter=new Promise((resolve,reject)=>resolve('butter'))
    const getColdDrinks=new Promise((resolve,reject)=>resolve('softdrinks'))
    let ticket;
    try{
        ticket=await wifebringingTickets;
    }catch(e){
        ticket='shows sad face'
    }
    const result=await Promise.all([popcorn,butter,getColdDrinks])
    return result
}
asi().then((m)=>console.log(m));
console.log('person4: shows Ticket');
console.log('person5: shows Ticket');