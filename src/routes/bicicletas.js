const express = require('express');
const router = express.Router();
const db = require('../database')


router.get('/', async (req, res) => {
    const list_Bici = await db.query("SELECT *FROM productos where id_categoria = 2");
    res.render('bicicletas/bicicletas_pag',{list_Bici});
});

router.get('/detalle_bicicletas/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_bicicletas ON productos.id = descripcion_bicicletas.id_producto WHERE productos.id = '" + id + "'")
        res.render('bicicletas/detalle_bicicletas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;