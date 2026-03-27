var express =  require('express');
var bodyparser = require("body-parser");
var AdminRoute = require("./routes/admin");
var UserRoute = require("./routes/user");
var upload = require("express-fileupload");

var app = express();
app.use(express.static("public/"))
app.use(bodyparser.urlencoded({extended:true}))
app.use(upload());


app.use("/",UserRoute );
app.use("/admin",AdminRoute);

app.listen(1000);



// CREATE TABLE about_company (
//     about_company_id INT PRIMARY KEY AUTO_INCREMENT ,
//     company_name VARCHAR(100),
//     company_address Text,
//     company_mobile VARCHAR(12),
//     company_email VARCHAR(100),
//     company_whatsapp VARCHAR(12),
//     instagram TEXT,
//     youtube TEXT,
//     facebook TEXT,
//     twitter TEXT
// )