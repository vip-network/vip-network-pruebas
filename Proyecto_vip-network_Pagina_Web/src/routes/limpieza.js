const express = require('express');
const router = express.Router();
const db = require('../database')


router.get('/', async (req, res) => {
    const list_limpieza = await db.query("SELECT *FROM productos where id_categoria = 9");
    res.render('limpieza/limpieza',{list_limpieza});
});


router.get('/detalle_limpieza/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        // const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_limpieza ON productos.id = descripcion_limpieza.id_producto WHERE productos.id = '" + id + "'")
        
        res.render('limpieza/detalle_limpieza', {idProducto: idProducto.recordset[0]});
        // res.render('bicicletas/detalle_bicicletas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;