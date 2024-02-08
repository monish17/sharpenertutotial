const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize= require('./util/database');
<<<<<<< HEAD
=======
const Product= require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
<<<<<<< HEAD
=======
const { Console } = require('console');
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< HEAD
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
    .sync()
    .then( result =>{
=======
app.use((req,res,next)=>{
    User.findByPk(1)
        .then(user =>{
            req.user=user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

Product.belongsTo(User,{constraints : true, onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{ through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});

sequelize
    // .sync({force : true})
    .sync()
    .then( result =>{
        return User.findByPk(1);
    })
    .then(user =>{
        if(!user){
            return User.create({name:'monish',email:'monishft@gmail.com'})
        }
        return user;
    })
    .then(user =>{
        return user.createCart();
    }
    )
    .then(cart =>{
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
        app.listen(4000);
    })
    .catch(err =>{
        console.log(err);
    })

app.listen(3000);
