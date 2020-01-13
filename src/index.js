const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

const MsSQLStore = require('mssql-session-store')(session);
const passport = require('passport')

const {database} = require('./keys');

//inicializations
const app = express();
require('./lib/passport')

//settings
app.set('port', process.env.PORT || 5050);
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
    store: MsSQLStore[database]
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user;
    next();
})

//routes
app.use(require('./routes'));
app.use(require('./routes/authentications'));
app.use('/juegos', require('./routes/juegos'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/locales_admin', require('./routes/locales_admin'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
})
