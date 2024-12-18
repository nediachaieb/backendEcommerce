const express = require("express") 
const mongoose =require("mongoose")
const app=express()
const dotenv = require("dotenv")
const categorie = require("./models/categorie")
const scategorie = require("./models/scategorie")
const article = require("./models/article")
const categorieRouter =require("./route/categorie.route")
const scategorieRouter =require("./route/scategorie.route")
const articleRouter =require("./route/article.route")
require('dotenv').config()
//dotenv.config()
//BodyParser Middleware
app.use(express.json()); 

// Connexion à la base données

mongoose.connect(process.env.DATABASECLOUD)
.then(() => {console.log("DataBase Successfully Connected");})
.catch(err => { console.log("Unable to connect to database", err);
process.exit(); });

app.use("/api/categories",categorieRouter)
app.use('/api/scategories',scategorieRouter);
app.use('/api/articles', articleRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`); });

module.exports = app;
