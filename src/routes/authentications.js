const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

const csrfProteccion = csrf();
router.use(csrfProteccion);

//////////////////REGISTRO//////////////////////////////////

//renderizar el formulario

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('user/signup', {csrfToken: req.csrfToken()});
});

//recibir datos del formulario
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    // successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
    session: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

////////////////LOGIN///////////////////////

////renderizar el formulario
router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('user/signin', {csrfToken: req.csrfToken()}) 
});

//recibir datos del formulario
router.post('/signin',isNotLoggedIn,  passport.authenticate('local.signin', {
    // successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

//perfil
router.get('/profile',isLoggedIn, (req, res) =>{
    res.render('user/profile')
});

// //cierra la sesion actual
router.get('/logout', isLoggedIn, (req, res) =>{
    req.logOut();
    res.redirect('/');
});



module.exports = router;