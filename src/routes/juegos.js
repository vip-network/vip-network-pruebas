const express = require('express');
const router = express.Router();

const db = require('../database')
const {isLoggedIn} = require('../lib/auth')

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('juegos/add')
})

//agregar
router.post('/add', isLoggedIn, async (req, res) => {
    const {nombre_juego} = req.body;    
    const newLink = {
        nombre_juego
    };
    await db.query("INSERT INTO juegos (nombre_juego) values('" + newLink.nombre_juego + "' )");
    req.flash('success', 'Juego guardado correctamente');
    res.redirect('/juegos/');//redirecciona a la lista     
});

//mostrar lista
router.get('/', isLoggedIn, async (req,res) => {
    var juegos = await db.query("SELECT * FROM juegos");
    res.render('juegos/list', {juegos});
});

//delete
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM juegos WHERE id = '" + id + "' ")
    req.flash('success', 'Juego Eliminado correctamente');
    res.redirect('/juegos/');
});

//rescata los datos seleccionados al editar y los muestra
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const juegos = await db.query("SELECT * FROM Juegos WHERE id = '" + id + "'")
    res.render('juegos/edit', {juegos: juegos.recordset[0]});
});

//update datos 
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {nombre_juego} = req.body;    
    await db.query("UPDATE juegos SET nombre_juego ='" + nombre_juego + "' WHERE id = '" + id + "' ");    
    req.flash('success', 'Juego Actualizado correctamente');
    res.redirect('/juegos/');
});


module.exports = router;