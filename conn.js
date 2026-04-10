const mysql = require("mysql2");
const util = require("util");

const conn = mysql.createConnection({
    host:"byntlnhm1gumhdshoqwc-mysql.services.clever-cloud.com",
    user:"uepwrrc5m4hpuokl",
    password:"9DvWW7HDQExLk6uI1Bbe",
    database:"byntlnhm1gumhdshoqwc"
})

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;