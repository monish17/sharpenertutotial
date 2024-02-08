const Product = require('../model/product');

exports.postData = (req,res,next)=>{
    console.log("request arrived");
      console.log(req.body);
      const name = req.body.name;
      const email = req.body.email;
      const phonenumber = req.body.phonenumber;
      const schedule = req.body.schedule;
      Product.create({
          name:name,
          email:email,
          phonenumber : phonenumber,
          schedule: schedule
      }).then(result =>{
          res.redirect('/')
          console.log(result);
      }).catch(err =>{
          console.log(err);
      })
  }
  
  exports.retrieveData = (req,res,next)=>{
    console.log('arrived to retrieve data')
    Product.findAll()
      .then(data => {
          res.json(data);
        })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  
  exports.deleteData = (req,res,next)=>{
    const email = req.params.email;
    Product.destroy({
        where: {
            email: email
        }
    })
    .then(result => {
        if (result === 0) {
            return res.status(404).json({ message: 'Email not found' });
          }
  
        res.status(200).json({ message: 'Data deleted successfully' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
  }