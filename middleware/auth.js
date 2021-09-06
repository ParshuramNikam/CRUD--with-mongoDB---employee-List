const jwt = require('jsonwebtoken');

const Employee = require('../models/employeeModel')

const auth = async (req,res, next) => {

    try{
        const loginCookie = await req.cookies.loginCookie;
        const verifyUser = jwt.verify(loginCookie, process.env.SECRET_KEY);

        console.log(`verifyUser value `);
        console.log(verifyUser);
        
        const user = await Employee.findOne({ _id: verifyUser._id })
        console.log(user);
        next();
    } catch(err){
        res.status(400).send(err);
        // res.status(400).redirect('/Employee/login');    // you can redirect him to login page if it is not registerd with us
        console.log(err);
    }
}

module.exports = auth;
