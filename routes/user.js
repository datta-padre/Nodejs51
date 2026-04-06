const express = require("express");
const exe = require("../conn");
const { escape } = require("mysql2");

const route = express.Router();

route.get("/", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var Banner = await exe(`SELECT * FROM banner`);
    var obj = {"about_company":about_company[0],"Banner":Banner,"is_login":verfiyaccount(req)}
    res.render("user/index.ejs",obj);
})

route.get("/about", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req)}
    res.render("user/about.ejs",obj);
})

route.get("/shop", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);

        var sql = ` SELECT *,
    (SELECT MIN(product_price) FROM product_pricing
    WHERE  products.product_id =product_pricing.product_id)
    AS price,
    (SELECT MAX(product_duplicate_price) FROM product_pricing
    WHERE products.product_id =product_pricing.product_id )
    AS product_duplicate_price FROM products`

    var product = await exe(sql);

    var obj = {"about_company":about_company[0],"product":product,"is_login":verfiyaccount(req)}


    res.render("user/shop.ejs",obj)
})

route.get("/blog", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req)}
    res.render("user/blog.ejs",obj);
})

route.get("/contact", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req)}
    res.render("user/contact.ejs",obj)
})


route.get("/view_product/:id",async (req,res)=>{
    var id = req.params.id;

    var about_company = await exe(`SELECT * FROM about_company`);
    var sql = ` SELECT * FROM products WHERE product_id = '${id}'`;
    var sql1 = ` SELECT * FROM product_pricing  WHERE  product_id = '${id}'`

    var price = await exe(sql1);

    var product_info = await exe(sql);

    var obj = {"product_info":product_info[0],"price":price,"about_company":about_company[0],"is_login":verfiyaccount(req)}

    res.render("user/product_info.ejs",obj)

})

route.get("/login", async function(req,res){
     var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req)}
    res.render("user/login.ejs",obj)
})

route.get("/create_account", async function(req,res){
     var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req)}
    res.render("user/create_account.ejs",obj)
})

route.post("/create_new_account",async function(req,res){
    var d = req.body;
    var sql = ` INSERT INTO users(user_name,user_mobile,user_email,password)
    VALUES
    ('${d.user_name}','${d.user_mobile}','${d.user_email}','${d.password}')`;

    var data = await exe(sql);
    res.redirect("/login")
})

route.post("/do_login",async function(req,res){
    var d= req.body;
    var sql = ` SELECT * FROM users WHERE user_email ='${d.user_email}' AND password = '${d.password}'`;

    var user = await exe(sql);

    if(user.length > 0){
        req.session.user_id =user[0].user_id;
        console.log("session User Id ",req.session.user_id);
        res.redirect("/shop")
    }else{
        res.redirect("/login")
    }
    
})


function verfiyaccount(req,res,next){

    // req.session.user_id = 4;

    var user_id = req.session.user_id;
    
    if(user_id){
        return true;
    }else{
        return false;
    }

}

route.get("/logout",function(req,res){

    req.session.user_id = undefined;

    res.redirect("/login")
    
})

route.get("/add_to_cart/:product_id/:product_pricing_id",async function(req,res){

    var product_id = req.params.product_id;
    var product_pricing_id = req.params.product_pricing_id;

    var sql = ` INSERT INTO cart (product_id , product_pricing_id,user_id ,qty)
    VALUES(${product_id},${product_pricing_id},${req.session.user_id},1)`;

    var data = await exe(sql);

    res.redirect("/cart");
})

route.get("/cart",async function(req,res){
     var about_company = await exe(`SELECT * FROM about_company`);

     var sql=`SELECT * FROM products ,product_pricing ,cart 
     WHERE
      products.product_id = product_pricing.product_id
      AND 
      product_pricing.product_pricing_id = cart.product_pricing_id
      AND products.product_id = cart.product_id
     AND 
    cart.user_id = ${req.session.user_id}`


    var cart_data = await exe(sql);


    var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req),"cart":cart_data}

    console.log(cart_data)
    res.render("user/cart.ejs",obj)
})

route.get("/qtyincrease/:id",async function(req,res){

    var id = req.params.id;

    var sql = `UPDATE cart SET qty = qty+1 WHERE cart_id = '${id}' `;

    var data = await exe(sql);

    res.redirect("/cart")

})


route.get("/checkout", async function(req,res){

    var sql=`SELECT * FROM products ,product_pricing ,cart 
     WHERE
      products.product_id = product_pricing.product_id
      AND 
      product_pricing.product_pricing_id = cart.product_pricing_id
      AND products.product_id = cart.product_id
     AND 
    cart.user_id = ${req.session.user_id}`

    var cart = await exe(sql);

    console.log(cart)

     var about_company = await exe(`SELECT * FROM about_company`);
     var obj = {"about_company":about_company[0],"is_login":verfiyaccount(req),"cart":cart}

     if(cart.length > 0){
        res.render("user/checkout.ejs",obj)
     }else{
        res.redirect("/shop")
     }

    
})

route.post("/order",function(req,res){
    res.send("Order Done")
})


module.exports = route;


// CREATE TABLE cart (
//     cart_id INT PRIMARY KEY AUTO_INCREMENT ,
//     product_id INT ,
//     product_pricing_id INT ,
//     user_id INT ,
//     qty INT 

// )

