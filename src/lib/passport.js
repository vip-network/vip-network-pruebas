const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, correo, pass, done) => {
    const rows = await db.query("SELECT * FROM usuarios WHERE correo = '"+ correo +"' ")
    const rowsf = rows.recordsets[0]//.recordsets posicionsa dentro de recorsets -- .recordsets[0] posisiona dentro del recosrsets/recorset/objeto 0

    //validacion login
    if (rowsf.length > 0) {//valida el correo
        const user = rowsf[0];// posisiona en el objeto 0 dentro del arreglo

        const validPass = await helpers.matchPassword(pass, user.pass)
        if (validPass) {//valdia la pass
            done(null, user, req.flash('success','Bienvenido ' + user.nombre));
        }else{
            done(null, false, req.flash('message', 'clave invalida '));
        }

    }else{
        return done(null, false, req.flash('message','el correo Ingresado no existe'))
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'pass',
    passReqToCallback: true,
    session: false
}, async (req, nombre, pass, done) =>{
    const {correo, tipo_usuario} = req.body;
    const newUser = {
        nombre,
        pass,
        correo,
        tipo_usuario
    };
    newUser.pass = await helpers.encryptPassword(pass);
    const result = await db.query("INSERT INTO usuarios (nombre,pass,correo,tipo_usuario) values('" + newUser.nombre + "','" + newUser.pass + "','" + newUser.correo + "','" + newUser.tipo_usuario + "')")    

    const idResult = await db.query("SELECT id FROM usuarios WHERE nombre = '" + newUser.nombre + "' and pass = '" + newUser.pass + "' and correo = '" + newUser.correo + "' and tipo_usuario ='" + newUser.tipo_usuario + "' ")
    // console.log(idResult.recordset[0])
    newUser.id = (idResult.recordset[0]).id
    // console.log(newUser)
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const rows = await db.query("SELECT * FROM usuarios WHERE id = '"+ id +"'")
    // console.log(rows.recordset[0])
    done(null, rows.recordset[0])
});



// validacion del correo junto al pass (aplicar en modelo actual)
// router.get("/checkUser", (req, res, next) => {
//     if(!req.query) {
//         res.status(400).json({
//             error: 'Informacion no recibida'
//         });
//     }
//     const correo = req.query.correo;
//     const pass = req.query.pass;
//     model.find({ correo: correo, pass: pass }, (err, user) => {
//         if(err) { // un error indica que hubo problemas con la consulta
//             res.status(500).json({
//                 error: 'Eror de Servidor'
//             });
//         }
//         if(!user) { // Si el usuario no existe
//             res.status(400).json({
//                 message: 'Usuario no existente'
//             });
//         }
//         console.log("USUARIO ENCONTRADO: ", user);
//         // AQUI PUEDES LLAMAR A TU SIGUIENTE MIDDLEWARE O DEVOLVER EL RESULTADO
//         next(); //<= SI VAS A LLAMAR AL SIGUIENTE MIDDLEWARE
//     });
// });