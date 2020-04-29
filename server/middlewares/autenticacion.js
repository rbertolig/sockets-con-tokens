//importar libreria jsonwebtoken
const jwt = require('jsonwebtoken');

//SECRET del Token, definido aqui para simplicidad en este demo/prueba
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'este-es-el-secret-de-desarrollo';

//====================
//Verifica Token
//====================
//verificar que el token es valido en caso positivose valida con 'next()'
// la variable 'decoded' contendra el 'payload' del token
let verificaToken = (client, next) => {
    // validar que exista el parametro 'query' dentro del socket nuevo y que se haya recibido un 'token'
    if (client.handshake.query && client.handshake.query.token) {
        //en caso positivo decodificar el token con jwt
        jwt.verify(client.handshake.query.token, process.env.TOKEN_SEED, (err, decoded) => {
            //si ocurre error en la decodificacion del token abortar indicando error          
            if (err) {
                return next(new Error(err.message));
            }
            // si lleva aqui se autentico el token y 'client.decoded' contendra el payload
            client.decoded = decoded;
            //validar autenticacion con 'next()'
            next();
        });
    } else {
        //si no se recibio el token abortar con error
        return next(new Error('Token no recibido'));
    }
}

module.exports = {
    verificaToken
}