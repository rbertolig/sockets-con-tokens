//==================================================
// Implementacion de los sockets del lado servidor
//==================================================

//importar io desde server.js declarado alla con 'module.exports'
const { io } = require('../server');

//importar funcion de validacion de token
const { verificaToken } = require('../middlewares/autenticacion');

//capturar evento de conexion de clientes con validacion de Token en middleware
io.use(verificaToken)
    .on('connection', (client) => {
        // Si llega aqui la Conexion fue autenticada imprimir en consola del lado servidor:
        console.log('Cliente remoto ON-LINE');
        console.log('Datos del Usuario extraidos del payload del Token', client.decoded);

        // enviar mensaje de bienvenida al usuario ( revisar consola del navegador web cliente)
        client.emit('usuarioAutenticado', `Bienvenido ${client.decoded.usuario.nombre}`);

        //capturar cuando un cliente se desconecta del servidor
        // esto escucha el 'tag' reservado 'disconnect'
        client.on('disconnect', () => {
            console.log('Cliente remoto OFF-LINE');
        });

        // implementar resto de la comunicacion via sockets aca

    });