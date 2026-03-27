const express = require("express");
const exe = require("../conn")

const route = express.Router();

route.get("/", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var Banner = await exe(`SELECT * FROM banner`);
    var obj = {"about_company":about_company[0],"Banner":Banner}
    res.render("user/index.ejs",obj);
})

route.get("/about", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0]}
    res.render("user/about.ejs",obj);
})

route.get("/shop", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);

        var sql = ` SELECT *,
    (SELECT MIN(product_price) FROM product_pricing
    WHERE  products.product_id =product_pricing.product_id )
    AS price ,
    (SELECT MAX(product_duplicate_price) FROM product_pricing
    WHERE products.product_id =product_pricing.product_id )
    AS product_duplicate_price FROM products`

    var product = await exe(sql);

    var obj = {"about_company":about_company[0],"product":product}


    console.log(product);


    res.render("user/shop.ejs",obj)
})

route.get("/blog", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0]}
    res.render("user/blog.ejs",obj);
})

route.get("/contact", async function(req,res){
    var about_company = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":about_company[0]}
    res.render("user/contact.ejs",obj)
})

module.exports = route;