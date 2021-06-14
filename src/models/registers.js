require('dotenv').config()
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },

    number: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    CPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

});
studentSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET);
        this.tokens = await this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log("the error part" + error);
    }
}


const Register = mongoose.model("Register", studentSchema);

module.exports = Register;                            