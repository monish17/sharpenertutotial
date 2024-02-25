const Product = require('../model/product');

exports.postData = (req,res,next)=>{
    console.log("request arrived");
      console.log(req.body);
      //const id = req.body.id;
      const postLink = req.body.postLink;
      const postDescription = req.body.postDescription;
      Product.create({
          postLink:postLink,
          postDescription:postDescription
      }).then(result =>{
        res.json({
            createPost: { 
                id: result.id, 
                postLink: postLink,
                postDescription: postDescription
            }
        })
        console.log(result);
      }).catch(err =>{
          console.log(err);
      })
  }
