const express = require('express');
const router = express.Router();
const stripe = require ('stripe');
const Stripe =stripe('sk_test_51QYUE9ALOkybihim4bh6PwcK9UaaDWh2wsmjl1U57SuWuF0CSXQ3GYzE4SRtuOGO81eQ1HycjPb3ngniAHnLBz9T00vM4RnQ6y');
// Remplacez par votre clé secrète Stripe
router.post('/', async (req, res) => { console.log(req.body)
    let status, error;
    const { token, amount } = req.body;
    try {
    await Stripe.charges.create({
        source: token.id,
        amount,
        currency: 'usd',
    });
    status = 'success';
    } 
    catch (error) {
    console.log(error);
    status = 'Failure';
    }
    res.json({ error, status });
    });


    
module.exports = router;