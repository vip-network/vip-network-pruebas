// impide que se metan a las pagina sin estar logeado

module.exports = {
    // protege para que solo se puedan ver las rutas de agregar, eliminar, actualizar y mostar solo cuando este logeado
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin')
    },
    // protege para que solo se puedan ver las rutas de login solo si no estan logeados
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res. redirect('/profile')
    }
}