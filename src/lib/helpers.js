const bcrypt = require('bcrypt')

const helpers = {};

//encripta la pass
helpers.encryptPassword = async (pass) => {
    // console.log(pass)
    const salt = await bcrypt.genSalt(10);
    const hast = await bcrypt.hash(pass, salt)
    return hast;
};

//compara en el logeo la pass encriptada de la base con la ingresada(valida la clave)

helpers.matchPassword = async (pass, savedPassword) => {
    
    try {
        return await bcrypt.compare(pass, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;