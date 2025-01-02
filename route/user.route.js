const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/////activer compte
const nodemailer = require('nodemailer');
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'nedia.chaieb.19@gmail.com',
    pass:''
    },
    tls:{
    rejectUnauthorized:false
    }
    })

//Register
router.post('/register', async (req, res, )=> {
    const{name,email,password,role,avatar}=req.body;
    const user = await User.findOne({ email })
    if (user) return res.status(404).send({ success: false, message: "Account already exists" })
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(password,salt);
    const newUser=new User({
    name:name,
    email:email,
    password:hash,

    avatar:avatar
    });
    try {
    await newUser.save();

    // Send verification email
const mailOption = {
    from: '"verify your email " <abcCorporation@gmail.com>',
    to: newUser.email,
    subject: 'Verification of your email',
    html: `<h2>${newUser.name}! Thank you for registering on our website</h2>
    <h4>Please verify your email to proceed...</h4>
    
    <a
    href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">Click here</a>` // remplace isactive de user
    };
    try {
    await transporter.sendMail(mailOption);
    console.log('Verification email sent to your gmail account');
    } catch (error) {
    console.log(error);
    }
    return res.status(201).send({ success: true, message: "Account created successfully", user: newUser })
    } catch (error) {
    res.status(409).json({ message: error.message });
}
});
// Email verification endpoint
router.get('/status/edit', async (req, res) => {
    try {
    const email = req.query.email;
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(404).send({ success: false, message: "User not found"
    });
    }
    user.isActive = true;
    await user.save();
    res.send({ success: true, message: "Account activated successfully" });
    } catch (err) {
    return res.status(404).send({ success: false, message: err.message });
    }
    });
// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
try {
const users = await User.find().select("-password");
return res.status(200).json(users)
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Generate token
const generateToken = (user) => {
    return jwt.sign({ user }, process.env.TOKEN, { expiresIn: '60s' });
    };
// Login
router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).send({ success: false, message: "All fields arerequired" });
        }
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).send({ success: false, message: "Account doesn'texist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Please verify yourcredentials' });
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({
        success: true,
        token,
        refreshToken,
        user,
        isActive: user.isActive
        });
        } catch (error) {
        res.status(404).json({ message: error.message });
        }
        });
        // Refresh token
        const generateRefreshToken = (user) => {
        return jwt.sign({ user }, process.env.REFRESH_TOKEN, { expiresIn: '1y' });
        };
        router.post('/refreshToken', async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
        return res.status(404).json({ success: false, message: 'Token Not Found' });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
        return res.status(406).json({ success: false, message: 'UnauthorizedAccess' });
        }
        const token = generateToken(user);
const newRefreshToken = generateRefreshToken(user);
res.status(200).json({
token,
refreshToken: newRefreshToken
});
});
});
module.exports = router;