// require('dotenv').config();  //--> no need bcause in server.js on 1st line this require is written

const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)
.then( () => console.log("succesfully connected !!") )
.catch(err => {
    console.log(err);
    console.log("Oops, not connected, check the error above");
});


require('./employeeModel');

