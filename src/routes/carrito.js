const express = require('express');
const router = express.Router();
const db = require('../database')
const {isLoggedIn} = require('../lib/auth')

const csrf = require('csurf');

const csrfProteccion = csrf();
router.use(csrfProteccion);


router.get('/', isLoggedIn,(req, res) => { 
    res.render('carrito/carrito_productos', {csrfToken: req.csrfToken()});
});

router.get('/', isLoggedIn,(req, res) => { 
    res.render('carrito/voucher_carro', {csrfToken: req.csrfToken()});
});


module.exports = router;