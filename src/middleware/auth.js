

const jwt = require('jsonwebtoken');
const Register = require("../models/registers");


//when we use middleware we must include (req,res,next)
const auth = async (req, res, next) => {
    try {
        const token = await req.cookies.jwt;
        const userVerify = await jwt.verify(token, process.env.SECRET);
        console.log(userVerify);
        const user = await Register.findOne({ _id: userVerify._id });
        console.log(user);
        next();
    } catch (error) {
        res.status(401).render("login");
    }
}

module.exports = auth;