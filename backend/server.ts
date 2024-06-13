const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "register"
})

app.post('/Register', (req: { body: { email: any; password: any; }; }, res: { json: (arg0: string) => any; }) => {
    const sql = "INSERT INTO login (`email`, `password`) VALUES (?)";
    const values = [
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err: any,data: string) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/Login', (req: { body: { email: any; password: any; }; }, res: { json: (arg0: string) => any; }) => {
    const sql = "SELECT * FROM login WHERE `email` =? AND `password` = ?";
    const values = [
        req.body.email,
        req.body.password
    ]
    db.query(sql, [req.body.email, req.body.password], (err: any,data: string) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Fail");
        }
    })
})

app.listen(3000, ()=> {
    console.log("listening")
})