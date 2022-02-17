const express = require('express');
const { Server } = require('socket.io');
const app = express();

const PORT = process.env.PORT || 8080 //Algo que va a cambiar según dónde se esté corriendo
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

const io = new Server(server);
let log = [];

app.use(express.static(__dirname + '/public'))
io.on('connection', (socket) => {
    socket.broadcast.emit('newUser')
        // para emitir un evento a todos menos al mío. Por cada Emit va un ON del otro lado (front)
    socket.on('message', data => {
        log.push(data);
        io.emit('log', log) // Con un io le llega a todos
    })
    socket.on('registered', data => {
        socket.emit('log', log); // envía uno a uno (cliente a servidor)
    })
}); //evento para poner a escuchar el socket