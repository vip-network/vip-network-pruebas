const express = require('express');
const router = express.Router();

const db = require('../database')
const {isLoggedIn} = require('../lib/auth')

//mostrar lista Select de usuarios
router.get('/',isLoggedIn, async (req,res) => {
    const usuario_local = await db.query("SELECT id, nombre FROM usuarios");
    const nombreLocal = await db.query("SELECT id, nombre FROM locales");
    const userF = (usuario_local.recordsets[0])
    const nombreLocalF = (nombreLocal.recordsets[0])
    console.log(userF)
    console.log(nombreLocal)
    res.render('locales_admin/add', {userF,nombreLocalF})

    
});

//agregar locales con usuario asignado
router.post('/', isLoggedIn, async (req, res) => {
    const {newLocal, nombre} = req.body;//NOMBRE VARIABLES DE LSOC AMPOS
    const newLink = {
        newLocal,
        nombre
    };
    // console.log(newLink)
    const final = await db.query("INSERT INTO locales (nombre,id_usuario) values('" + newLink.newLocal + "','" + newLink.nombre + "')");
    // console.log(final)
    // req.flash('success', 'Usuario guardado correctamente');
    res.redirect('/locales_admin/');//redirecciona a la lista 
});


module.exports = router;