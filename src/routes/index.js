// ***********************************************PAGINA PRINCIPAL*********************************************

const express = require('express');
const router = express.Router();

const Cart = require('../model/cart')
const nodemailer = require('nodemailer');

const db = require('../database')



//listas
router.get('/', async (req, res) => {

    const lista_productos_peluches = await db.query("SELECT top 4 * FROM productos where id_categoria = 1"); //peluches
    const lista_productos_bicicletas = await db.query("SELECT top 4 * FROM productos where id_categoria = 2"); //bicicletas
    const lista_productos_rodados = await db.query("SELECT top 4 * FROM productos where id_categoria = 3"); //rodados

    res.render('../views/index', {lista_productos_rodados, lista_productos_bicicletas})
});


// detalle de bicicletas pagina principal
router.get('/detalle_bicicletas/:id', async (req, res) => {

    const { id } = req.params;
    console.log(req.params) 

    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_bicicletas ON productos.id = descripcion_bicicletas.id_producto WHERE productos.id = '" + id + "'")

        console.log(idProducto.recordset[0])
        console.log(idDetalleProducto.recordset[0])
        res.render('bicicletas/detalle_bicicletas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

// detalle de rodados pagina principal
router.get('/detalle_rodados/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_rodados ON productos.id = descripcion_rodados.id_producto WHERE productos.id = '" + id + "'")
        // console.log(idProducto.recordset[0])
        // console.log(idDetalleProducto.recordset[0])
        res.render('rodados/detalle_rodados', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});



// ------------------------------carrito----------------------------------//

// agrega item al carro
router.get('/add/:id', async (req, res) =>{
  const productId = req.params.id;
    try {
        const Producto = await db.query("SELECT * FROM productos WHERE id = '"+ productId +"' ");
        const Productof = Producto.recordsets[0]        
        const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
        const product = await Productof.filter( (item) =>  {
            return item.id == productId;
        });

        cart.add(product[0], await productId);
        req.session.cart = cart;        
        res.redirect('/');

    } catch (e) {
        console.log(e);
    }
});

//
router.get('/carrito/carrito_productos', (req, res, next) => {
    if (!req.session.cart) {
      return res.render('/index', {
        products: null
      });
    }
    var cart = new Cart(req.session.cart);
    res.render('/index', {
      title: 'hola',
      products: cart.getItems(),
      totalPrice: cart.totalPrice
    });
});

// eliminar item carrito
router.get('/remove/:id',async (req, res, next) => {
var productId = req.params.id;
var cart = await new Cart(req.session.cart ? req.session.cart : {});

cart.remove(productId);
req.session.cart = cart;
res.redirect('/carrito_productos');
});

// ------------------------------fin carrito----------------------------------//


// ------------------------------email----------------------------------//
router.post('/enviar', async (req, res, next) => {

    const datosCliente = req.user
    console.log(datosCliente)

    const itemsCarro = req.session.cart.items
    console.log(itemsCarro)

    // crear un objeto de transporte reutilizable usando SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vipnetwork.informatica@gmail.com',
            pass: 'a44afb0b6808d662'
        }
    });

    // configura los datos del correo
    const mailOptions = {
        from: 'Vip-Network <vipnetwork.informatica@gmail.com>', 
        to: datosCliente.email,
        cc: '',
        subject: 'Comprobante de Cotizacion de productos',
        text: 'chao',
        html: 'hola'
    };
    

    // Envía el correo con el objeto de transporte definido anteriormente
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

        console.log('Mensaje enviado: ' + info.response);
        res.redirect('/carrito_productos');
    });
});
// ------------------------------fin email----------------------------------//


module.exports = router;