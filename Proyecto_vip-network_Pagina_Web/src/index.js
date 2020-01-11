const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const MsSQLStore = require('mssql-session-store')(session);
const passport = require('passport');
// const favicon = require('serve-favicon');

const {database} = require('./database');

//inicializadores
const app = express();
require('./lib/passport')

//settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'xbas257', 
    resave: false, 
    saveUninitialized: false,
    store: MsSQLStore[database],
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
// app.use(favicon(path.join(__dirname, 'public', favicon.ico)));
// app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    app.locals.login = req.isAuthenticated();// permite ver el menu dependiendo si la persona esta logeada o no
    app.locals.session = req.session;
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentications'));
// app.use('/+aqui va la carpeta', require('./routes/nombre del js que corresponde la carpeta'));
app.use('/bicicletas', require('./routes/bicicletas'));
app.use('/rodados', require('./routes/rodados'));
app.use('/peluches', require('./routes/peluches'));
app.use('/capsulas', require('./routes/capsulas'));
app.use('/maquinas', require('./routes/maquinas'));
app.use('/outdoor', require('./routes/outdoor'));
app.use('/cunas', require('./routes/cunas'));
app.use('/limpieza', require('./routes/limpieza'));
app.use('/seguridad_automotriz', require('./routes/seguridad_automotriz'));
app.use('/accesorios_automotriz', require('./routes/accesorios_automotriz'));
app.use('/vigilancia', require('./routes/vigilancia'));
app.use('/user', require('./routes/usuarios'));

app.use('/carrito_productos', require('./routes/carrito'));
app.use('/checkout', require('./routes/checkout'));



//public
app.use(express.static(path.join(__dirname, 'public')));


//starting the server
app.listen(app.get('port'), () => {
    console.log('servidor en el puerto', app.get('port'));
})
