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

        /**
         *  implementar resto de la comunicacion via sockets aca
         **/

        // capturar cuando sockets del cliente envian un mensaje
        // validarlo segun permiso del usuario extraido del user_role en el token
        client.on('enviarMensaje', (data, callback) => {
            console.log(`Permisos de ${client.decoded.usuario.nombre}: ${client.decoded.usuario.role}`)
            console.log('Mensaje recibido:', data);
            if (!callback) return; // validacion para evitar crash si se hizo emit sin callback
            // evaluar role del cliente para validar permiso segun token
            // en 'client.decoded.usuario' esta el payload del token
            switch (client.decoded.usuario.role) {
                // Role no autorizado
                case 'USER_ROLE':
                    console.log(`Usuario: ${client.decoded.usuario.nombre} PERMISO DENEGADO!`);
                    callback({
                        ok: false,
                        message: 'Usted no tiene permiso para realizar esa accion'
                    });
                    break;
                    // Role autorizado
                case 'ADMIN_ROLE':
                    callback({
                        ok: true,
                        message: 'Permiso condedido. Su mensaje ha sido procesado'
                    });
                    // implementar acciones para permiso concedido, ej:
                    console.log(`Usuario ${client.decoded.usuario.nombre} AUTORIZADO!`);

                    break;
                    // cualquier otra cosa
                default:
                    callback({
                        ok: false,
                        message: 'Usted no tiene permiso para enviar mensajes'
                    });
            }
            // resto de logica 

        });
    });