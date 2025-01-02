const express = require("express") 
const app=express()
const mongoose =require("mongoose")
const cors = require('cors')
const path = require('path'); // Ajout de l'importation de path

const dotenv = require("dotenv")
const categorie = require("./models/categorie")
const scategorie = require("./models/scategorie")
const article = require("./models/article")
const categorieRouter =require("./route/categorie.route")
const scategorieRouter =require("./route/scategorie.route")
const articleRouter =require("./route/article.route")
const paymentStripeRouter=require("./route/paymentStripe.route")
const userRouter =require("./route/user.route")
require('dotenv').config()
//dotenv.config()

//BodyParser Middleware

app.use(express.json()); 
app.use(cors())

// Connexion à la base données

mongoose.connect(process.env.DATABASECLOUD)
.then(() => {console.log("DataBase Successfully Connected");})
.catch(err => { console.log("Unable to connect to database", err);
process.exit(); });

// api 
app.use("/api/categories",categorieRouter)
app.use('/api/scategories',scategorieRouter);
app.use('/api/articles', articleRouter);
app.use('/api/paymentStripe', paymentStripeRouter);
app.use('/api/users', userRouter);

//dist reactjs
app.use(express.static(path.join(__dirname, './client/build'))); // Route pourles pages non trouvées, redirige vers index.html
app.get('*', (req, res) => { res.sendFile(path.join(__dirname,'./client/build/index.html')); });
app.listen(process.env.PORT, () => {console.log(`Server is listening on port ${process.env.PORT}`); });

module.exports = app;
