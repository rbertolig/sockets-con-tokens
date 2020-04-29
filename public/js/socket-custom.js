//=======================================================
// script para comunicacion con el servidor.
// contiene codigo para usar del lado 'cliente remoto'
//=======================================================

//colocamos un token fijo aqui para efecto de demo. expira en octubre 2020.
//pueden cambiarlo por un token suyo generado mediante jwt. Actualiar el 'SECRET' en server.js si usa su propio token
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJBRE1JTl9ST0xFIiwiZXN0YWRvIjp0cnVlLCJnb29nbGUiOmZhbHNlLCJfaWQiOiI1ZTlhMmNjMjcyZDUyZDM4ODBhYTc1NDUiLCJub21icmUiOiJUZXN0IDEiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIl9fdiI6MCwiaW1nIjoiNWU5YTJjYzI3MmQ1MmQzODgwYWE3NTQ1XzY4My5qcGcifSwiaWF0IjoxNTg4MDU1ODc0LCJleHAiOjE2MDM2MDc4NzR9.RJYxPXl_6xQO6nWMt-4_D-hl3eXc6Zqs7rlxURm40CM';

// levantar un socket desde este cliente hacia el servidor usando el servicio 'io'
// crear instancia del socket del lado cliente y enviar el token al servidor con el evento de conexion.
var socket = io({ query: { token } });
//otra forma de enviar el token
//var socket = io(`http://localhost:3000?token=${token}`);

// abrir conexion a travez del socket
socket.on('connect', () => {
    //confirmar en consola la conexion establecida  
    console.log("Conectado al Servidor");
});

socket.on('error', (error) => {
    // capturar error de autenticacion
    console.log(error);
    if (error == 'Token no recibido' || error == 'invalid token') {
        alert("Error de Autenticacion: " + error);
    }
});

//capturar perdida de conexion con el servidor de esta manera
socket.on('disconnect', function() {
    //confirmar en consola la conexion perdida 
    console.log('Servidor: OFF-LINE');
});

//escuchar informacion enviada por el servidor del lado cliente
//Mensaje de bienvenida luego de la autenticacion con Token
socket.on('usuarioAutenticado', (mensaje) => {
    console.log('El servidor dice:', mensaje);
});

// implementar el resto de la comunicacion con socketsaca