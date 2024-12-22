const express = require('express');
const router = express.Router();
const Article=require("../models/article")

// afficher la liste des articles.
router.get('/', async (req, res, )=> {
    try {
    const articles = await Article.find();
    res.status(200).json(articles);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

// afficher la liste des articles par page
router.get('/pagination', async(req, res) => {
    const page = req.query.page ||1 // Current page
    const limit = req.query.limit ||5; // Number of items per page
    // Calculez le nombre d'éléments à sauter (offset)
    const offset = (page - 1) * limit;
    try {
    // Effectuez la requête à votre source de données en utilisant les paramètres de pagination
    
    const articlesTot = await Article.countDocuments();
    const articles = await Article.find( {}, null, {sort: {'_id': -1}})
    .skip(offset)
    .limit(limit)
    res.status(200).json({articles:articles,tot:articlesTot});
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });



// créer un nouvel article
router.post('/', async (req, res) => {
    const nouvarticle = new Article(req.body);
    try {
        const response = await nouvarticle.save();
        const articles = await Article.findById(response._id)
            .populate("scategorieID")
            .exec();
        res.status(200).json(articles);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
// chercher un article
router.get('/:articleId',async(req, res)=>{
    try {
    const art = await Article.findById(req.params.articleId);
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
// modifier un article
router.put('/:articleId', async (req, res)=> {
    try {
    const art = await Article.findByIdAndUpdate(
    req.params.articleId,
    { $set: req.body },
    { new: true }
    );
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

// Supprimer un article
router.delete('/:articleId', async (req, res)=> {
    const id = req.params.articleId;
    await Article.findByIdAndDelete(id);
    res.json({ message: "article deleted successfully." });
    });

// chercher un article par s/cat
router.get('/scat/:scategorieID',async(req, res)=>{
    try {
    const art = await Article.find({ scategorieID:
    req.params.scategorieID}).exec();
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

// chercher un article par cat
router.get('/cat/:categorieID', async (req, res) => {
    try {
    // Recherche des sous-catégories correspondant à la catégorie donnée
    const sousCategories = await Scategorie.find({ categorieID:
    req.params.categorieID }).exec();
    
    // Initialiser un tableau pour stocker les identifiants des sous-catégories trouvées
    
    const sousCategorieIDs = sousCategories.map(scategorie => scategorie._id);
    // Recherche des articles correspondant aux sous-catégories trouvées
    const articles = await Article.find({ scategorieID: { $in:
    sousCategorieIDs } }).exec();
    res.status(200).json(articles);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });



// modifier quantité seulement
router.put('/qty/:id', async (req, res) => { console.log(req.body.quantity)
    const qty = req.body.quantity||0;
    const articleId=req.params.id||null;
    const oldArticle=await Article.findById(articleId)
    try {
    const articleUpdated = await Article.findByIdAndUpdate(
    articleId,
    { qtestock: oldArticle.qtestock - qty},
    { new: true } // Return the updated document
    );
    if (!articleUpdated) {
    return res.status(404).json({ message: 'Product not found' });
    }
    const art = await
    Article.findById(articleId).populate("scategorieID").exec();
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }});
    
    module.exports = router;    