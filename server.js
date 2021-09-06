require('dotenv').config()

require('./models/db')
// require('./models/employeeModel');   --> already require in "./model/db"... so need to require again

const employeeController = require('./controller/employeeController');
const path = require('path');
const express = require('express');
const ejs = require('ejs');

const cookieParser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT ;

const views_path = path.join(__dirname,'/template/views')

app.set('View engine', 'ejs');
app.set('views',views_path);

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// app.use( bodyparser.urlencoded({extended:true}) )

// app.get('/', /* employeeController */ (req,res)=>{
//     console.log("From server.js");
//     res.render('index.ejs');
// })      
/* Thgs will execute employeeController directly -- code in last callback function i.e.,(req,res)=>{} will 'not get execute' */


app.use('/employee', employeeController);  /* --> executes employeeController which is a router for '/employees' url */
// app.use('/employee',employeeController);

app.listen(PORT, ()=> console.log( `listening on ${PORT} port`));
