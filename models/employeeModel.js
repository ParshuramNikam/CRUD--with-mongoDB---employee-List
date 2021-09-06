require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema(
    {
        fullName:{
            type : String,
            required: "Full Name is Required"
        },
        email:{
            type : String,
            unique: true,
            required: "Email Address is Required*"
        },
        mobile:{
            type : Number,
            unique: true,
            required: "mobile Number is Required*"
        },
        city:{
            type : String
        },
        password:{
            type: String
        },
        tokens: [{
            token: {
                type: String,
                require: true
            }
        }]
    }
)


employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}


employeeSchema.pre("save", async function(next){
    
    if( this.isModified('password') ) {
        console.log(`before hashing = ${this.password}`);
        this.password  = await bcrypt.hash( this.password, 12 );
        console.log(`aFTER hashing = ${this.password}`);    
    }
})

const Employee = mongoose.model('Employee',employeeSchema);

module.exports = Employee;