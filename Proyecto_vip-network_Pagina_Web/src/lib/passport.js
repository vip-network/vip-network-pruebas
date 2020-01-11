const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');
const helpers = require('../lib/helpers');

// logeo del usuario
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, email, pass, done) => {
    const rows = await db.query("SELECT * FROM usuarios WHERE email = '"+ email +"' ")
    const rowsf = rows.recordsets[0]

    //validacion login
    if (rowsf.length > 0) {//valida el correo
        const user = rowsf[0];// posisiona en el objeto 0 dentro del arreglo
        const validPass = await helpers.matchPassword(pass, user.pass)
        if (validPass) {//valdia la contraseña
            done(null, user, req.flash('success','Bienvenido ' + user.nombre));
        }else{
            done(null, false, req.flash('message', 'clave invalida '));
        }
    }else{
        return done(null, false, req.flash('message','el correo Ingresado no existe'))
    }

}));

// registro de usuario
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true,
}, async (req, email, pass, done) =>{ 
    const {nombre,apellido,direccion,telefono} = req.body;
    const newUser = {
        nombre,
        apellido,
        email,
        direccion,
        pass,
        telefono
    };           
    const emailBase =  await db.query("SELECT email FROM usuarios WHERE email = '"+email+"' ");
    const emailBasef = emailBase.recordset

    //valida si el correo exixte en la base 
    if (emailBasef.length > 0) {
        return done(null, false, req.flash('message','Correo ya existente, ingrese uno valido'));
        
    }else{
        newUser.pass = await helpers.encryptPassword(pass);
        const result = await db.query("INSERT INTO usuarios (nombre,apellido,email,direccion,pass,telefono) values('" + newUser.nombre + "','" + newUser.apellido + "','" + newUser.email + "','" + newUser.direccion + "','" + newUser.pass + "','" + newUser.telefono + "')")     

        // solo sirve para recuperar el id del registro ingresado
        const idResult = await db.query("SELECT id FROM usuarios WHERE nombre = '" + newUser.nombre + "' and apellido = '" + newUser.apellido + "' and email = '" + newUser.email + "' and direccion ='" + newUser.direccion + "' and  pass ='" + newUser.pass + "', telefono ='" + newUser.telefono + "'") 
        newUser.id = (idResult.recordset[0]).id 
        return done(null, newUser);
    }; 
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) =>{
    const rows = await db.query("SELECT * FROM usuarios WHERE id= '"+ id +"' ");
    done(null, rows.recordset[0])

});