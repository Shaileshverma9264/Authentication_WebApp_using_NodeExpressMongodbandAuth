require('dotenv').config()
const express = require("express");
const { templates } = require("handlebars");
const app = express();
require("./db/conn");
const hbs = require("hbs");
const port = process.env.PORT || 8001;
const Register = require("./models/registers");
const path = require("path");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cookieParser = require('cookie-parser')


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials")



app.use(cookieParser())
app.set("views", template_path);
app.use(express.static(static_path))
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(partial_path);


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/contact", (req, res) => {
    res.render("contact")
});
app.get("/service", (req, res, next) => {
    res.render("service")
});
app.get("/services", auth, (req, res, next) => {
    res.render("services")
});
app.get("/about", (req, res) => {
    res.render("about")
});
app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/contact", async (req, res) => {
    try {
        const password = req.body.password;
        const CPassword = req.body.CPassword;
        if (password === CPassword) {
            const studentRegistration = await Register({
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                number: req.body.number,
                message: req.body.message,
                password: req.body.password,
                CPassword: req.body.CPassword
            });
            // token generate
            const token = await studentRegistration.generateAuthToken();

            res.cookie("jwt", token, { expires: new Date(Date.now() + 30000), httpOnly: true });
            //token end
            const createStudentData = await studentRegistration.save();
            res.status(201).render("index")
        } else {
            res.send("password are not matching")
        }
    } catch (error) {
        console.log(error);
    }

})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });


        const token = await useremail.generateAuthToken();
        res.cookie("jwt", token, { expires: new Date(Date.now() + 30000), httpOnly: true });

        if (useremail.password === password) {
            res.status(201).render("services");
        } else {
            res.render("login.hbs");
        }

    } catch (error) {
        console.log(error)
    }

})


app.get("*", (req, res) => {
    res.render("error404")
});

app.listen(port, (req, res) => {
    console.log(`server is running on the ${port}...`)
})