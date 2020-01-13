const express = require('express');
const router = express.Router();
const db = require('../database')

router.get('/', async (req, res) => {
    const list_Maquinas = await db.query("SELECT *FROM productos where id_categoria = 6");
    res.render('maquinas/maquinas',{list_Maquinas});
});

router.get('/detalle_maquinas/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_maquinas ON productos.id = descripcion_maquinas.id_producto WHERE productos.id = '" + id + "'")
        res.render('maquinas/detalle_maquinas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;