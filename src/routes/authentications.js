const express = require('express');
const router = express.Router();

const passport = require('passport')
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')
//////////////////Login//////////////////////////////////

//renderizar el formulario
router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
});

//recibir datos del formulario
router.post('/signin', isNotLoggedIn, (req, res , next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next);
});

////////////////registro///////////////////////

//renderizar el formulario
router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

//recibir datos del formulario
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//
router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('profile')
});

//cierra la sesion actual
router.get('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/signin');
})


module.exports = router;