const express = require('express');
const router = express.Router();
const db = require('../database')


router.get('/', async (req, res) => {
    const list_acc_Auto = await db.query("SELECT *FROM productos where id_categoria = 5");
    res.render('accesorios_automotriz/accesorios_automotriz',{list_acc_Auto});
});

router.get('/detalle_accesorios_automotriz/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_accesorio_automotriz ON productos.id = descripcion_accesorio_automotriz.id_producto WHERE productos.id = '" + id + "'")
        res.render('accesorios_automotriz/detalle_accesorios_automotriz', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;