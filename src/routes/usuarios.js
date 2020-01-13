const express = require('express');
const router = express.Router();
const db = require('../database')
const {isLoggedIn} = require('../lib/auth')

router.get('/add', (req, res) =>{
    res.render('usuarios/add')
})

//agregar
router.post('/add', isLoggedIn, async (req, res) => {
    const {nombre, pass, correo, tipo_usuario} = req.body;
    const newLink = {
        nombre,
        pass,
        correo,
        tipo_usuario
    };
    await db.query("INSERT INTO usuarios (nombre,pass,correo,tipo_usuario) values('" + newLink.nombre + "','" + newLink.pass + "','" + newLink.correo + "','" + newLink.tipo_usuario + "')");
    req.flash('success', 'Usuario guardado correctamente');
    res.redirect('/usuarios/');//redirecciona a la lista 
});

//mostrar lista
router.get('/', isLoggedIn, async (req,res) => {
    var usuarios = await db.query("SELECT * FROM usuarios");
    res.render('usuarios/list', {usuarios});
    // console.log(usuarios)
});

//delete
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM usuarios WHERE id = '" + id + "' ")
    req.flash('success', 'Usuario Eliminado correctamente');
    res.redirect('/usuarios/');
});

//rescata los datos seleccionados al editar y los muestra
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usuarios = await db.query("SELECT * FROM usuarios WHERE id = '" + id + "'")
    // console.log(usuarios.recordset[0])
    res.render('usuarios/edit', {usuarios: usuarios.recordset[0]});
});

//update datos 
router.post('/edit/:id',isLoggedIn,  async (req, res) => {
    const {id} = req.params;
    const {nombre, pass, correo, tipo_usuario} = req.body;    
    await db.query("UPDATE usuarios SET nombre ='" + nombre + "', pass ='" + pass + "', correo='" + correo + "', tipo_usuario='" + tipo_usuario + "' WHERE id = '" + id + "'");
    req.flash('success', 'Usuario Actualizado correctamente');
    res.redirect('/usuarios/');
});


module.exports = router;