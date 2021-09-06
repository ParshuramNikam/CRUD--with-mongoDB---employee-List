const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


const auth = require('../middleware/auth');

//Auth middlerware used here ton check the user is alredy logged in or not
router.get('/list', auth , (req,res)=>{
    console.log("In browser loginCookie value : "+ req.cookies.loginCookie);
    res.send("HII user you are verifies ......... You are allowed to this page ....... It's our secret page  :-)");
});

router.get('/',(req,res)=>{
    res.render('empRegistration.ejs');
});

router.post('/', (req,res)=>{
    console.log(req.body);
    try{
        insertRecord(req,res);
    } catch(error){
        console.log(error);
    }
});

router.get("/login", auth, (req,res)=>{
    res.render('empLogin.ejs')
});

router.post('/login', (req,res)=>{
    try {
        checkLoginCredentials(req,res);
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid Login Credentials");
    }
});

router.get('/secret', auth , (req,res)=>{
    console.log("In browser loginCookie value : "+ req.cookies.loginCookie);
    res.send("ssssss --------- HII user you are verifies ......... You are allowed to this page ....... It's our secret page  :-)");
});



const insertRecord= async (req,res) =>{
    const employee = new Employee(
        {
            fullName : req.body.fullName,
            email : req.body.email,
            mobile : req.body.mobile,
            city : req.body.city,
            password: req.body.password
        }
    );

    const token = await employee.generateAuthToken();
    console.log(`register token : ${token}`);

    res.cookie('regiterCookie', token, {
        expires: new Date(Date.now()+ 60000)
    });


    await employee.save( (err, document)=>{
        if(err){
            console.log(err);
            if(err.name == "ValidationError"){
                console.log("here");
                for( let field in err.errors){
                    switch (err.errors[field].path) {
                        case 'fullName':
                            res.send(err.errors);
                            break;
                        case 'email':
                            console.log("ewmail");
                            res.send(err.errors);
                            res.status(400);
                            break;
                        case 'mobile':
                            res.send(err.errors.message);
                            break;
                        default:
                            res.send(err.message)
                            break;
                    }
                }
            }   
            res.send("something else")
        }
        else{
            console.log(document);
            res.redirect('/employee/list');
        }
    } )
}

const checkLoginCredentials = async (req,res) => {

    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    const dbEntry = await Employee.findOne({email: inputEmail});
    
    if(dbEntry==null){
        res.status(400).send("Invalid Login Credentials");
        console.log("Document with inputEmail not present");
        return;
    }
    

    const isEqual = bcrypt.compare( inputPassword, dbEntry.password )
    
    if( isEqual ){
        const token  = await dbEntry.generateAuthToken();
        console.log(`register token : ${token}`);

        res.cookie('loginCookie',token);

        res.status(200).redirect('/employee/list');
        console.log(`succesfully Logeed in with username: ${inputEmail}   and  password: ${inputPassword}`);
    }else{
        res.status(400).send("Invalid Login Credentials");
    }
};
 
  
module.exports = router;

