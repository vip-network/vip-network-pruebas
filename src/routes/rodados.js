const express = require('express');
const router = express.Router();
const db = require('../database')

router.get('/', async (req, res) => {
    const list_Roda = await db.query("SELECT * FROM productos where id_categoria = 3");
    res.render('rodados/rodados',{list_Roda});
});


router.get('/detalle_rodado/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_rodados ON productos.id = descripcion_rodados.id_producto WHERE productos.id = '" + id + "'")
        // console.log(idProducto.recordset[0])
        // console.log(idDetalleProducto.recordset[0])
        res.render('rodados/detalle_rodado', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;