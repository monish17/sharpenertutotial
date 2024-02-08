const Product = require('../model/product');

exports.postData = (req,res,next)=>{
    console.log("request arrived");
      console.log(req.body);
      //const id = req.body.id;
      const Expense_Amount = req.body.Expense_Amount;
      const description = req.body.description;
      const category = req.body.category;
      Product.create({
          Expense_Amount:Expense_Amount,
          description  : description ,
          category: category
      }).then(result =>{
        res.json({
            expense: { 
                id: result.id, 
                Expense_Amount: Expense_Amount,
                description: description,
                category: category
            }
        })
        console.log(result);
      }).catch(err =>{
          console.log(err);
      })
  }


  exports.deleteData = (req,res,next)=>{
    console.log('delete request arrived');
    console.log(req.params);
    const id = req.params.hiddenIdValue;
    Product.destroy({
        where: {
            id: id
        }
    })
    .then(result => {
        if (result === 0) {
            return res.status(404).json({ message: 'id not found' });
          }
  
        res.status(200).json({ message: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });

  }

exports.retrieveData= (req,res,next)=>{
    console.log('request arrived');
    Product.findAll()
      .then(data => {
          res.json(data);
        })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
      });
}